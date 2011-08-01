var patterns = {};

patterns.xss = [/((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/ix, //Simple XSS
/((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/I, //IMG SRC XSS
/((\%3C)|<)[^\n]+((\%3E)|>)/I]; //All XSS

patterns.lfi = [/\.\.\//]; //Basic ../ match

patterns.sql = [/((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i, //SQL meta-characters
/\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i, //Simple SQLi
/((\%27)|(\'))union/i, //SQLi with UNION
/exec(\s|\+)+(s|x)p\w+/ix, //SQLi for MSSQL
/UNION(?:\s+ALL)?\s+SELECT/i]; //SQLi UNION SELECT

module.exports = patterns;
