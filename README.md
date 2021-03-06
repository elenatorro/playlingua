Playlingua
==========================

#Resumen

El propósito de este trabajo es diseñar y desarrollar una aplicación web, llamada Playlingua, para mejorar el proceso de aprendizaje de la lengua a través de la gamificación. Exploraremos tres aspectos principales: las tecnologías de Procesamiento del Lenguaje Natural (PLN), la gamificación y el Diseño Centrado en el Usuario (UCD) como metodología de desarrollo. En el área del PLN, elegiremos entre las distintas herramientas disponibles dependiendo de cómo pueden ser aplicadas en el proyecto final. Para aumentar la aceptación de la aplicación, estudiaremos las ventajas y los aspectos positivos de usar la gamificación en aplicaciones de aprendizaje y cómo de influyente puede ser en términos de motivación, compromiso, calidad de aprendizaje y entretenimiento. Todo será desarrollado siguiendo el proceso del UCD, cuyo objetivo es construir aplicaciones basadas en la Experiencia del Usuario (UX). Además, estudiaremos las últimas tecnologías web con el objetivo de desarrollar una aplicación que estará disponible para todos, online y gratis.

#Abstract

The purpose of this study is to design and develop a web application, named Playlingua, to improve the language learning process through gamification. There are three main aspects to explore: Natural Language Process (NLP) technologies, gamification and User Centered Design (UCD) as a developing methodology. In the NLP area, we will choose between the different available tools depending on how they can be applied in the final project. To increase the acceptance of the application, we will study the advantages and positive effects of using gamification in learning applications and how it influences users in terms of motivation, engagement, learning quality and entertainment. Everything will be developed following the UCD process, whose goal is to build applications based on User Experience (UX). In addition, we will study the latest trending web technologies in order to develop a platform that will be available for everyone, online and free.

LICENSE

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Playlingua</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.com/elenatorro/playlingua" property="cc:attributionName" rel="cc:attributionURL">Elena Torro</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="https://github.com/elenatorro/playlingua" rel="dct:source">https://github.com/elenatorro/playlingua</a>.

INSTRUCTIONS

* Clone the repo

```
git clone https://github.com/elenatorro/playlingua.git
```

* Install npm dependencies

```
$ npm install
```

* Install bower dependencies

```
bower install
```

* Configure global configuration variables

You have a sample in config > variables_sample.js (remove '\_sample')

## Run local
* Run mongodb database (you should have mongodb already installed)

```
$ sudo mongod

```

In your variables.js file, set 'environment' to 'development'.

* Run gulp

```
$ gulp
```

Now, open localhost in the port you've chosen. You can build the whole project with:

```
$ gulp build
```


### Deploy

* You'll have to tell your server to run app.js. For heroku it's already setted in the Procfile.
* In your variables.js file, set 'environment' to 'production'.

## Future work:

* Refactor
* Instructions & tools to build playlingua for another language (it's currently in Spanish)

Any feedback is very welcome!
