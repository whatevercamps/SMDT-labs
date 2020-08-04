const _ = require('underscore');

exports.COUNTRY_CODE_TO_GOOGLE_SEARCH_DOMAIN = require('./google_domains.json');

exports.GOOGLE_SEARCH_DOMAINS = Object.values(exports.COUNTRY_CODE_TO_GOOGLE_SEARCH_DOMAIN);

exports.GOOGLE_SEARCH_DOMAIN_TO_COUNTRY_CODE = _.invert(exports.COUNTRY_CODE_TO_GOOGLE_SEARCH_DOMAIN);

exports.GOOGLE_SEARCH_URL_REGEX = new RegExp(`^(http|https)://(www.){0,1}((${exports.GOOGLE_SEARCH_DOMAINS.join(')|(')}))/search?.*$`, 'i');

exports.DEFAULT_GOOGLE_SEARCH_DOMAIN_COUNTRY_CODE = 'US';

exports.REQUIRED_PROXY_GROUP = 'GOOGLE_SERP';

exports.GOOGLE_DEFAULT_RESULTS_PER_PAGE = 10;
