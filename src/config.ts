export let environment;

if ((typeof (process.env.NODE_ENV == 'string') ? process.env.NODE_ENV : 'development') == 'production') {
    environment = {
        'httpPort' : 5000,
        'httpsPort' : 5001,
        'envName' : 'production',
        'hashingSecret' : 'secretHashCode',
        'maxChecks' : 5
    };
} else {
    environment = {
        'httpPort' : 3000,
        'httpsPort' : 3001,
        'envName' : 'development',
        'hashingSecret' : 'thisIsASecret',
        'maxChecks' : 5
    }
}