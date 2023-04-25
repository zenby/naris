# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [0.2.0](https://gitlog.ru:2222/Naris/soermono/compare/auth-0.1.0...auth-0.2.0) (2023-04-25)


### Features

* **#234:** add Dockerfile ([0adc7b6](https://gitlog.ru:2222/Naris/soermono/commit/0adc7b6e66d6e3f42f58be5df3ed58bab1834a6f)), closes [#234](https://gitlog.ru:2222/Naris/soermono/issues/234)
* **#234:** fix build.sh for use only required packages ([f54fc79](https://gitlog.ru:2222/Naris/soermono/commit/f54fc79eec7893c63c760c007f06a0aa503e84dc))
* **#234:** update project.json config for get package.json ([7abe33c](https://gitlog.ru:2222/Naris/soermono/commit/7abe33c7696c04503483621575c93667f4906a2e)), closes [#234](https://gitlog.ru:2222/Naris/soermono/issues/234)
* add signIn and infrastructure for it ([6fe8b0c](https://gitlog.ru:2222/Naris/soermono/commit/6fe8b0cafd243374128bb7a41ebccbb40592c09a))
* add signout ([2a1c0e7](https://gitlog.ru:2222/Naris/soermono/commit/2a1c0e7eed6e5f0cd4b28554fc26211d12617ed8))
* add user module ([9aa5a3e](https://gitlog.ru:2222/Naris/soermono/commit/9aa5a3e7c4bdf8bfd381b50842101c8108bc043c))
* add validation pipe ([3b10560](https://gitlog.ru:2222/Naris/soermono/commit/3b10560122e9f9291dbb0984cf40f26ee629f495))
* **auth:**  add LocalAuthGuard ([a4a4a83](https://gitlog.ru:2222/Naris/soermono/commit/a4a4a83d6521e277d4a3e92b582a4086e88f00f7))
* **auth:**  add LocalAuthGuard to auth.controller ([b222ac4](https://gitlog.ru:2222/Naris/soermono/commit/b222ac45a71cb977219e59498b6e0d8572dfa43d))
* **auth-config:** add redirectUrl to config factory ([f950494](https://gitlog.ru:2222/Naris/soermono/commit/f95049455fb0564f3a32f440743be5fd16ae0c86))
* **auth-controller:**  add redirect to signin if auth is ok ([fb57458](https://gitlog.ru:2222/Naris/soermono/commit/fb574580deac1d71ff15f4683f7c91e185f74920))
* **auth-controller:** add endpoint for getting access token for a specified user ([8c3f2f5](https://gitlog.ru:2222/Naris/soermono/commit/8c3f2f544f87654306b608aad9031df0235287a8))
* **auth-controller:** add oAuth endpoints for Yandex ([40c163d](https://gitlog.ru:2222/Naris/soermono/commit/40c163da6b9e59737fff90b96eba126f61700737))
* **auth-google:** add same site & fix lint error ([f484ee2](https://gitlog.ru:2222/Naris/soermono/commit/f484ee28ae1c0b4c8c57d5c4eb9bcac5bee91009))
* **auth-open-id:** add auth service for open id contracts ([038c8bf](https://gitlog.ru:2222/Naris/soermono/commit/038c8bff504b62d5833df67cf86febb876fc36af))
* **auth-openid-test:** add integration test for google & yandex ([6d31da7](https://gitlog.ru:2222/Naris/soermono/commit/6d31da79c30ecb00c4f2e22fa95549147dfe3a2f))
* **auth-openid-test:** use toThrowError instead try-catch ([b3d2190](https://gitlog.ru:2222/Naris/soermono/commit/b3d2190531c0b3a8a42aa5495c146d5f3c21b722))
* **auth-openid:** add openid auth controller ([8e6694d](https://gitlog.ru:2222/Naris/soermono/commit/8e6694d0fd693dfb6c74c70425e15cab42bfac34)), closes [#2](https://gitlog.ru:2222/Naris/soermono/issues/2)
* **auth-openid:** setup auth open id module ([189e8b6](https://gitlog.ru:2222/Naris/soermono/commit/189e8b6bf4170c242bb3644d8cd76ddb28ea9457))
* **auth-service:** add function to find or create user for oAuth ([8839d63](https://gitlog.ru:2222/Naris/soermono/commit/8839d63025afc91465672800637a6dddba5d9b1b))
* **auth-service:** add user role to access & refresh tokens for issue [#256](https://gitlog.ru:2222/Naris/soermono/issues/256) ([65dbc85](https://gitlog.ru:2222/Naris/soermono/commit/65dbc853dc5e11072738fda71773dc235f37543c))
* **auth-strategy:** call auth open id service from google strategy ([90dd174](https://gitlog.ru:2222/Naris/soermono/commit/90dd1746ed060a97c9f8937804bfacb5cff2fc4e))
* **auth:** add env variables for yandex auth ([e6c6078](https://gitlog.ru:2222/Naris/soermono/commit/e6c60782dd055e83ca31c242f18942c97dcbea4c))
* **auth:** add GET /auth/access_token endpoint ([7706a22](https://gitlog.ru:2222/Naris/soermono/commit/7706a220472d8b19ee8ecb05018f51a22bbc5011))
* **auth:** add refreshCookie strategy and guard ([d76f03a](https://gitlog.ru:2222/Naris/soermono/commit/d76f03a216235494855de46d0ece759cebe88633))
* **auth:** add types ([d93a348](https://gitlog.ru:2222/Naris/soermono/commit/d93a3489c4ac859d913cfdc3c49a990b3244755a))
* **auth:** add uuid in jwt ([532b781](https://gitlog.ru:2222/Naris/soermono/commit/532b781f8acb21e962d80bb65b8bdd3742a132de))
* **auth:** add uuid to user entity [#177](https://gitlog.ru:2222/Naris/soermono/issues/177) ([9626013](https://gitlog.ru:2222/Naris/soermono/commit/962601373f8ae13b06e939f62e10ecb43b72aa4e))
* **auth:** add yandexAuthGuard ([0fb2332](https://gitlog.ru:2222/Naris/soermono/commit/0fb23324e248dd2366973f0b865efde0144c3ec4))
* **auth:** create YandexStrategy for passport auth ([0138fce](https://gitlog.ru:2222/Naris/soermono/commit/0138fce18a9a4a87f56263b96115e431e3e06244))
* **auth:** implement handleRequest in YandexAuthGuard ([f1ed710](https://gitlog.ru:2222/Naris/soermono/commit/f1ed710b171856f802bfe18f0bf5fa7fcad24f05))
* **auth:** move logic back to AuthService ([985e424](https://gitlog.ru:2222/Naris/soermono/commit/985e424e34336d7b039d332bba36cf80684d6975))
* **auth:** move method from auth.service to local.strategy ([f3dadba](https://gitlog.ru:2222/Naris/soermono/commit/f3dadbaf3771649ad9abd333c72ee7f393b7b517))
* **auth:** remove the extra wrapper ([c86f61b](https://gitlog.ru:2222/Naris/soermono/commit/c86f61b40c453cbc07455d280e77051f422bb678))
* **auth:** update test for /signin ([32cbdf2](https://gitlog.ru:2222/Naris/soermono/commit/32cbdf2dc528ec34e029b43d489908670b14125f))
* **decorators:** implement role decorator ([0999fce](https://gitlog.ru:2222/Naris/soermono/commit/0999fcee4faccd93036e69039a0f0d9936e8d92d))
* enriched the User entity ([40dc898](https://gitlog.ru:2222/Naris/soermono/commit/40dc8984c2702e70680ade8e51787b69359c6369))
* **env:** add env args for example ([a877875](https://gitlog.ru:2222/Naris/soermono/commit/a8778752e887c87a2c81eaceff41227502b1412a))
* **google:** add google auth strategy ([884e106](https://gitlog.ru:2222/Naris/soermono/commit/884e106b4ad7cc7994609eaa0c88efb2b144a581)), closes [#2](https://gitlog.ru:2222/Naris/soermono/issues/2)
* **guards:** add role guard ([517582d](https://gitlog.ru:2222/Naris/soermono/commit/517582d1c3725892acac703894f18379ba2c9add))
* **jwt-payload:** add user role field ([83617c9](https://gitlog.ru:2222/Naris/soermono/commit/83617c9e9eb92077f6b1e31ece70df0d5cc6d0d0))
* **user-block:** fix naming & use one method for block and unblock user field ([d80178e](https://gitlog.ru:2222/Naris/soermono/commit/d80178e1081abfd5cc050ebbd199d5e7d7061ff1))
* **user-block:** fix user block tests ([4f2565c](https://gitlog.ru:2222/Naris/soermono/commit/4f2565ce70d8ec731a117f080c41ed570312679c))
* **user-dto:** rename create user dto for open id ([2f6c35e](https://gitlog.ru:2222/Naris/soermono/commit/2f6c35e33632f7feccbc98ef6e3e1de9201efac2))
* **user-entity:** add roles to user entity ([b5b92eb](https://gitlog.ru:2222/Naris/soermono/commit/b5b92ebd23691b22150d274435604db3131bdb26))
* **user-service:** add user list representation for admin ([350041c](https://gitlog.ru:2222/Naris/soermono/commit/350041c9e69c0d6ed8cc58cdedf6592a9b3a0a2c))
* **user-service:** remove useless method & dto ([55447ba](https://gitlog.ru:2222/Naris/soermono/commit/55447ba4344a0d64cf3e2f536781c7c2b7152878))
* **user:** add  empty password support for oAuth users ([7af5b50](https://gitlog.ru:2222/Naris/soermono/commit/7af5b50ae63147b84b8ade06bfc39919aaffe5cb))
* **user:** add block & unblock user logic with endpoints ([04bf208](https://gitlog.ru:2222/Naris/soermono/commit/04bf2088d7ff98797dc7e8bc13610c4a7bf6fc55))
* **user:** add model for open id creation user ([dfd46e8](https://gitlog.ru:2222/Naris/soermono/commit/dfd46e8b89215047b8dad2656aa102b0fe3369d8))
* **user:** add tests ([9fce46c](https://gitlog.ru:2222/Naris/soermono/commit/9fce46ce800eb60bdff29eff35646812577316c4))
* **user:** fix tests when check all test suites ([0547006](https://gitlog.ru:2222/Naris/soermono/commit/0547006057242a790aeff9583cdaeb83ae5c185b))
* **user:** implement user deletetion functoinality ([d15e1fd](https://gitlog.ru:2222/Naris/soermono/commit/d15e1fd75a8d073fdfb44814fde7ad5a329d946e))
* **user:** remove required empty password ([9e903ac](https://gitlog.ru:2222/Naris/soermono/commit/9e903ac2b0015e5b5ccb51ed5d56639b4204f496))


### Bug Fixes

* **#234:** remove timestamp in image tag ([5abbff9](https://gitlog.ru:2222/Naris/soermono/commit/5abbff97a504a23c24165ab4b70dbcdb271df3de)), closes [#234](https://gitlog.ru:2222/Naris/soermono/issues/234)
* **auth-controller:** add empty string email field checking ([d709cb2](https://gitlog.ru:2222/Naris/soermono/commit/d709cb242533a04aaf07b17c62c1e3121199d2cb))
* **auth-controller:** fix email post parameter handling ([d21c41b](https://gitlog.ru:2222/Naris/soermono/commit/d21c41b4542e5282ca1f0e3627928d16a8abe955))
* **auth-controller:** replace email param into the  POST body ([8132990](https://gitlog.ru:2222/Naris/soermono/commit/8132990e91ea33c6fab4b570b9d393cfc77abf57))
* **auth:** exclude sessions from yandex auth ([bcfd49a](https://gitlog.ru:2222/Naris/soermono/commit/bcfd49ad62eb1bdc30792f9fda832a9d221bbcdc))
* **auth:** signup after add uuid field to user ([3d1a20f](https://gitlog.ru:2222/Naris/soermono/commit/3d1a20fcaa2daf597c7f2e0c36f8006c15ce13c0))
* fixed uuid moduleNameMapper in jest.config.ts ([981b845](https://gitlog.ru:2222/Naris/soermono/commit/981b845b030d1ae3aee7f0e85b916f9b81e30478))
* **jwt-payload:** fix UserRole import ([9ecae7b](https://gitlog.ru:2222/Naris/soermono/commit/9ecae7bb984f56bf1701d192dae0fc77e07b3ce5))
* removed unused eslint-disable in jest.config.ts ([373963d](https://gitlog.ru:2222/Naris/soermono/commit/373963d1fe77580e814fe30d4e70833fe1dac4d5))
* typeorm import fix ([72e6656](https://gitlog.ru:2222/Naris/soermono/commit/72e6656392ba049019439494013c490bbf209760))
* **user-service-spec:** add configuration mock for jwt ([dcc3018](https://gitlog.ru:2222/Naris/soermono/commit/dcc3018efd136755b869f28f42b3cb401e608578))
* **user-service-spec:** fix expect function call ([ddfb1cf](https://gitlog.ru:2222/Naris/soermono/commit/ddfb1cff717598fb5a7bac7df122f1076d752c92))

## 0.1.0 (2022-12-15)


### Features

* add auth project ([d5b2003](https://gitlog.ru:2222/Naris/soermono/commit/d5b200389ce011791cc2e3b6426ebad5cb89ff5e))
* add response interface ([eae6d36](https://gitlog.ru:2222/Naris/soermono/commit/eae6d36fd3b05b773a73a7c02b09adc0a282b92a))
* add User decorator ([1a931aa](https://gitlog.ru:2222/Naris/soermono/commit/1a931aa7df983fe1946aa4fed547268ee3bfffe7))
* has been added config ([f976d74](https://gitlog.ru:2222/Naris/soermono/commit/f976d74618551b999ebe70a3478ae4f2db8bf3d3))
* setup swagger for auth app ([969171f](https://gitlog.ru:2222/Naris/soermono/commit/969171f066a571b9072d9b47262148b39a0b7316))


### Bug Fixes

* add jwt passport strategy, refactor jwt-auth guard ([2ec706d](https://gitlog.ru:2222/Naris/soermono/commit/2ec706d73494b6d8db1ea57a482d754837a3628a))
* add new field to config ([2796dc8](https://gitlog.ru:2222/Naris/soermono/commit/2796dc8d15b3c74f463e499c37fe85f7ff8db148))
* **auth:** remove duplicates because of testing ([50064ec](https://gitlog.ru:2222/Naris/soermono/commit/50064ec31bb45f5b836e94e121e9471adddb35e8))
* change config strucure, rename config fields, applied changes in auth.service ([9b6fd4d](https://gitlog.ru:2222/Naris/soermono/commit/9b6fd4d78d2e19ec5944bb1ebfbc250ea1779f1e))
* changed status codes to variables ([fb774dc](https://gitlog.ru:2222/Naris/soermono/commit/fb774dcb9b6de2c805e74c39d45db3f2cdbac247))
* controller and service with UserEntity, remove tests from auth.http ([b33a80e](https://gitlog.ru:2222/Naris/soermono/commit/b33a80eda494916814f71483f6be31cd552b1c05))
* corrected a typo, remove unused import ([fac210a](https://gitlog.ru:2222/Naris/soermono/commit/fac210a25171a01b5fbf792c6f2e0cc50227fe10))
* has been added return types, remove unused funcs ([ca5df48](https://gitlog.ru:2222/Naris/soermono/commit/ca5df48c3bd7ac5344282dfffa41e5d807cebb39))
* has been changed module location to the app dir ([81adbcf](https://gitlog.ru:2222/Naris/soermono/commit/81adbcfa81f2c26c082a6b95a39ed48e87d3f02c))
* remove console.log ([be3df5c](https://gitlog.ru:2222/Naris/soermono/commit/be3df5cf6daca54ae2e8869ee1651846d55a072d))
* remove unnecessary api prefixes for backend apps ([4f830bf](https://gitlog.ru:2222/Naris/soermono/commit/4f830bfbd6c5ac6cd70504ef4a882a3d41f5854d))
* remove unused imports from auth.controller ([566c66d](https://gitlog.ru:2222/Naris/soermono/commit/566c66d14baf16c373959e479318209e77e944fe))
* update ports for backend projects ([02e955d](https://gitlog.ru:2222/Naris/soermono/commit/02e955dfcc67113925dad2cfe249787b84188c7c))
* update swagger versions ([730c4a8](https://gitlog.ru:2222/Naris/soermono/commit/730c4a8e1fba62fbec6a0e150e6e7ac369521338))

## 0.1.0 (2022-12-10)


### Features

* add auth project ([d5b2003](https://gitlog.ru:2222/Naris/soermono/commit/d5b200389ce011791cc2e3b6426ebad5cb89ff5e))
* add response interface ([eae6d36](https://gitlog.ru:2222/Naris/soermono/commit/eae6d36fd3b05b773a73a7c02b09adc0a282b92a))
* add User decorator ([1a931aa](https://gitlog.ru:2222/Naris/soermono/commit/1a931aa7df983fe1946aa4fed547268ee3bfffe7))
* has been added config ([f976d74](https://gitlog.ru:2222/Naris/soermono/commit/f976d74618551b999ebe70a3478ae4f2db8bf3d3))
* setup swagger for auth app ([969171f](https://gitlog.ru:2222/Naris/soermono/commit/969171f066a571b9072d9b47262148b39a0b7316))


### Bug Fixes

* add jwt passport strategy, refactor jwt-auth guard ([2ec706d](https://gitlog.ru:2222/Naris/soermono/commit/2ec706d73494b6d8db1ea57a482d754837a3628a))
* add new field to config ([2796dc8](https://gitlog.ru:2222/Naris/soermono/commit/2796dc8d15b3c74f463e499c37fe85f7ff8db148))
* change config strucure, rename config fields, applied changes in auth.service ([9b6fd4d](https://gitlog.ru:2222/Naris/soermono/commit/9b6fd4d78d2e19ec5944bb1ebfbc250ea1779f1e))
* changed status codes to variables ([fb774dc](https://gitlog.ru:2222/Naris/soermono/commit/fb774dcb9b6de2c805e74c39d45db3f2cdbac247))
* controller and service with UserEntity, remove tests from auth.http ([b33a80e](https://gitlog.ru:2222/Naris/soermono/commit/b33a80eda494916814f71483f6be31cd552b1c05))
* corrected a typo, remove unused import ([fac210a](https://gitlog.ru:2222/Naris/soermono/commit/fac210a25171a01b5fbf792c6f2e0cc50227fe10))
* has been added return types, remove unused funcs ([ca5df48](https://gitlog.ru:2222/Naris/soermono/commit/ca5df48c3bd7ac5344282dfffa41e5d807cebb39))
* has been changed module location to the app dir ([81adbcf](https://gitlog.ru:2222/Naris/soermono/commit/81adbcfa81f2c26c082a6b95a39ed48e87d3f02c))
* remove console.log ([be3df5c](https://gitlog.ru:2222/Naris/soermono/commit/be3df5cf6daca54ae2e8869ee1651846d55a072d))
* remove unnecessary api prefixes for backend apps ([4f830bf](https://gitlog.ru:2222/Naris/soermono/commit/4f830bfbd6c5ac6cd70504ef4a882a3d41f5854d))
* remove unused imports from auth.controller ([566c66d](https://gitlog.ru:2222/Naris/soermono/commit/566c66d14baf16c373959e479318209e77e944fe))
* update ports for backend projects ([02e955d](https://gitlog.ru:2222/Naris/soermono/commit/02e955dfcc67113925dad2cfe249787b84188c7c))
* update swagger versions ([730c4a8](https://gitlog.ru:2222/Naris/soermono/commit/730c4a8e1fba62fbec6a0e150e6e7ac369521338))
