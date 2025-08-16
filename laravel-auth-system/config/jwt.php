<?php

return [

    /*
    |--------------------------------------------------------------------------
    | JWT Authentication Secret
    |--------------------------------------------------------------------------
    |
    | Don't forget to set this in your .env file, as it will be used to sign
    | your tokens. A helper command is provided for this:
    | `php artisan jwt:secret`
    |
    */

    'secret' => env('JWT_SECRET'),

    /*
    |--------------------------------------------------------------------------
    | JWT time to live
    |--------------------------------------------------------------------------
    |
    | Specify the length of time (in minutes) that the token will be valid for.
    | Defaults to 1 hour.
    |
    | You can also set this to null, to yield a never expiring token.
    | Some people may want this behaviour for e.g. a mobile app.
    | This is not particularly recommended, so make sure you have appropriate
    | systems in place to revoke these tokens.
    |
    */

    'ttl' => env('JWT_TTL', 60),

    /*
    |--------------------------------------------------------------------------
    | JWT refresh time to live
    |--------------------------------------------------------------------------
    |
    | Specify the length of time (in minutes) that the token can be refreshed
    | within. I.E. The user can refresh their token within a 2 week window of
    | the original token being created until they must re-authenticate.
    | Defaults to 2 weeks.
    |
    | You can also set this to null, to yield an infinite refresh time.
    | Some may want this instead of never expiring tokens for e.g. a mobile app.
    | This is not particularly recommended, so make sure you have appropriate
    | systems in place to revoke these tokens.
    |
    */

    'refresh_ttl' => env('JWT_REFRESH_TTL', 20160),

    /*
    |--------------------------------------------------------------------------
    | JWT hashing algorithm
    |--------------------------------------------------------------------------
    |
    | You can specify the algorithm that will be used to sign the token.
    |
    | See: https://github.com/namshi/jose/tree/master/src/Namshi/JOSE/Signer/OpenSSL
    | for a list of available algorithms.
    |
    */

    'algo' => env('JWT_ALGO', 'HS256'),

    /*
    |--------------------------------------------------------------------------
    | Required Claims
    |--------------------------------------------------------------------------
    |
    | Specify the required claims that must exist in any token.
    | A TokenInvalidException will be thrown in the comparison of the
    | required claims when validating the token.
    |
    */

    'required_claims' => [
        'iss',
        'iat',
        'exp',
        'nbf',
        'sub',
        'jti',
    ],

    /*
    |--------------------------------------------------------------------------
    | Persistent Claims
    |--------------------------------------------------------------------------
    |
    | Specify the claim keys to be persisted when refreshing a token.
    | `sub` and `iat` will automatically persist, in
    | addition to the these claims.
    |
    | Note: If a claim is not persisted, it will be lost when
    | the token is refreshed.
    |
    */

    'persistent_claims' => [
        // 'foo',
        // 'bar',
    ],

    /*
    |--------------------------------------------------------------------------
    | Lock Subject
    |--------------------------------------------------------------------------
    |
    | This will determine whether a `prv` claim is automatically added to
    | the token. The `prv` claim is used to store the subject's public key.
    |
    */

    'lock_subject' => true,

    /*
    |--------------------------------------------------------------------------
    | Leeway
    |--------------------------------------------------------------------------
    |
    | This property gives the jwt timestamp claims some "leeway".
    | Meaning that if you have any clock skew on your servers
    | then you will want to set this property and then use
    | it when validating the token.
    |
    | For example, if you have a clock skew of 1 minute, then
    | you would set this property to 60.
    |
    */

    'leeway' => env('JWT_LEEWAY', 0),

    /*
    |--------------------------------------------------------------------------
    | Blacklist Enabled
    |--------------------------------------------------------------------------
    |
    | In order to invalidate tokens, you must have blacklist enabled.
    | If you do not want or need this functionality, then you can
    | set this to false but it must be explicitly set as it shall
    | be enabled by default.
    |
    */

    'blacklist_enabled' => env('JWT_BLACKLIST_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Blacklist Grace Period
    |--------------------------------------------------------------------------
    |
    | When multiple concurrent requests are made with the same JWT,
    | it is possible that some of them fail, due to token regeneration
    | on every request.
    |
    | Set grace period in seconds to prevent parallel request failure.
    |
    */

    'blacklist_grace_period' => env('JWT_BLACKLIST_GRACE_PERIOD', 0),

    /*
    |--------------------------------------------------------------------------
    | Cookies encryption
    |--------------------------------------------------------------------------
    |
    | By default JWT uses cookies to store the token. If you disable
    | the encrypt, the cookies will be stored in plain text.
    |
    | It is recommended that you always keep the cookies encrypted.
    |
    */

    'decrypt_cookies' => false,

    /*
    |--------------------------------------------------------------------------
    | Providers
    |--------------------------------------------------------------------------
    |
    | Specify the various providers used throughout the package.
    |
    */

    'providers' => [

        /*
        | JWT Provider
        |
        | The provider is used to create and decode the tokens.
        |
        */

        'jwt' => Tymon\JWTAuth\Providers\JWT\Lcobucci::class,

        /*
        | Authentication Provider
        |
        | The provider is used to find the user using the source.
        |
        */

        'auth' => Tymon\JWTAuth\Providers\Auth\Illuminate::class,

        /*
        | Storage Provider
        |
        | The provider is used to store the token in the blacklist
        | and will be used to deal with the refresh.
        |
        */

        'storage' => Tymon\JWTAuth\Providers\Storage\Illuminate::class,

    ],

];
