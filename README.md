# octopus-tracker-price-viewer

This is a project that creates a simple website to display the recent [Octopus Tracker](https://octopus.energy/smart/tracker/) prices.
The website is useful to monitor the prices to inform how to save money.

You can use a website-widget app to add a widget on your phone to view the prices easily.


## Architecture

This is a serverless AWS application, with 3 main components - Lambda, S3, CloudFront.

A Lambda function is scheduled to generate an HTML containing the recent tracker prices, and store this HTML in S3.

CloudFront is used to serve the HTML with HTTPS and caching.

## Commands

Standard `npm` commands and AWS SAM CLI.

Install dependencies
```
npm install
```

Run tests
```
npm run test
```

Build
```
sam build
```

Deploy
```
sam deploy
```
