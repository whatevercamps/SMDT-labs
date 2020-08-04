const Apify = require('apify');
const vm = require('vm');
const _ = require('underscore');
const queryString = require('query-string'); // TODO: Use Node default
const { REQUIRED_PROXY_GROUP } = require('./consts');
const {
    DEFAULT_GOOGLE_SEARCH_DOMAIN_COUNTRY_CODE,
    COUNTRY_CODE_TO_GOOGLE_SEARCH_DOMAIN,
    GOOGLE_SEARCH_URL_REGEX,
    GOOGLE_DEFAULT_RESULTS_PER_PAGE,
} = require('./consts');

exports.createSerpRequest = (url, page) => {
    if (url.startsWith('https://')) url = url.replace('https://', 'http://');

    return {
        url,
        userData: {
            page,
        },
    };
};

exports.getInitialRequests = ({
    queries,
    mobileResults,
    countryCode,
    languageCode,
    locationUule,
    resultsPerPage,
}) => {
    return queries
        .split('\n')
        .map(item => item.trim())
        .filter(item => !!item)
        .map((queryOrUrl) => {
            // If it's search URL ...
            if (GOOGLE_SEARCH_URL_REGEX.test(queryOrUrl)) return exports.createSerpRequest(queryOrUrl, 0);

            // Otherwise consider it as query term ...
            const domain = COUNTRY_CODE_TO_GOOGLE_SEARCH_DOMAIN[(countryCode || '').toUpperCase()]
                || COUNTRY_CODE_TO_GOOGLE_SEARCH_DOMAIN[DEFAULT_GOOGLE_SEARCH_DOMAIN_COUNTRY_CODE];
            const qs = { q: queryOrUrl };

            // NOTE: Don't set the "gl" parameter, some Apify Proxy Google SERP providers cannot handle it!
            if (languageCode) qs.hl = languageCode;
            if (locationUule) qs.uule = locationUule;
            // Only add this param if non-default, the less query params the better!
            if (resultsPerPage && resultsPerPage !== GOOGLE_DEFAULT_RESULTS_PER_PAGE) qs.num = resultsPerPage;
            if (mobileResults) qs.xmobile = 1;

            return exports.createSerpRequest(`http://www.${domain}/search?${queryString.stringify(qs)}`, 0);
        });
};

exports.executeCustomDataFunction = async (funcString, params) => {
    let func;
    try {
        func = vm.runInNewContext(funcString);
    } catch (err) {
        Apify.utils.log.exception(err, 'Cannot compile custom data function!');
        throw err;
    }

    if (!_.isFunction(func)) throw new Error('Custom data function is not a function!'); // This should not happen...

    return func(params);
};

exports.getInfoStringFromResults = (results) => {
    return _
        .chain({
            organicResults: results.organicResults.length,
            paidResults: results.paidResults.length,
            paidProducts: results.paidProducts.length,
        })
        .mapObject((val, key) => `${key}: ${val}`)
        .toArray()
        .join(', ')
        .value();
};

exports.logAsciiArt = () => {
    console.log(`
 _______  _______  _______  _______  _______ _________ _        _______
(  ____ \\(  ____ \\(  ____ )(  ___  )(  ____ )\\__   __/( (    /|(  ____ \\
| (    \\/| (    \\/| (    )|| (   ) || (    )|   ) (   |  \\  ( || (    \\/
| (_____ | |      | (____)|| (___) || (____)|   | |   |   \\ | || |
(_____  )| |      |     __)|  ___  ||  _____)   | |   | (\\ \\) || | ____
      ) || |      | (\\ (   | (   ) || (         | |   | | \\   || | \\_  )
/\\____) || (____/\\| ) \\ \\__| )   ( || )      ___) (___| )  \\  || (___) |
\\_______)(_______/|/   \\__/|/     \\||/       \\_______/|/    )_)(_______)

 _______  _______  _______  _______  _        _______     _______  _______  _______
(  ____ \\(  ___  )(  ___  )(  ____ \\( \\      (  ____ \\   (  ____ \\(  ___  )(       )
| (    \\/| (   ) || (   ) || (    \\/| (      | (    \\/   | (    \\/| (   ) || () () |
| |      | |   | || |   | || |      | |      | (__       | |      | |   | || || || |
| | ____ | |   | || |   | || | ____ | |      |  __)      | |      | |   | || |(_)| |
| | \\_  )| |   | || |   | || | \\_  )| |      | (         | |      | |   | || |   | |
| (___) || (___) || (___) || (___) || (____/\\| (____/\\ _ | (____/\\| (___) || )   ( |
(_______)(_______)(_______)(_______)(_______/(_______/(_)(_______/(_______)|/     \\|\n`);
};

exports.createDebugInfo = (request, response) => {
    let statusCode = null;
    if (response) statusCode = _.isFunction(response.status) ? response.status() : response.statusCode;

    return {
        requestId: request.id,
        url: request.url,
        method: request.method,
        retryCount: request.retryCount,
        errorMessages: request.errorMessages,
        statusCode,
        durationSecs: (request.userData.finishedAt - request.userData.startedAt) / 1000,
    };
};

exports.ensureAccessToSerpProxy = async () => {
    const userInfo = await Apify.client.users.getUser();
    // Has access to group and nonzero limit.
    const hasGroupAllowed = userInfo.proxy.groups.filter(group => group.name === REQUIRED_PROXY_GROUP).length > 0;
    const hasNonzeroLimit = userInfo.limits.monthlyGoogleSerpRequests > 0;
    if (!hasGroupAllowed || !hasNonzeroLimit) {
        Apify.utils.log.error(`You need access to ${REQUIRED_PROXY_GROUP}`
            + ' Apify Proxy group in order to use this actor. Please contact support@apify.com to get the access.');
        process.exit(1);
    }
    // Check that SERP limit was not reached.
    if (userInfo.limits.isGoogleSerpBanned) {
        Apify.utils.log.error('You have reached your limit for the number of Google SERP queries on Apify Proxy.'
            + ' Please contact support@apify.com to increase the limit.');
        process.exit(1);
    }
};
