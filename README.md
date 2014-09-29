append
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> [Transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform) which appends to each data string.


## Installation

``` bash
$ npm install flow-append
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

To use the module,

``` javascript
var append = require( 'flow-append' );
```

#### append( value[, options] )

Returns a transform `stream` in which a `value` is appended to each streamed `chunk`. 

To create a stream,

``` javascript
var stream = append( '\n' );
```

The default options are as follows:
*	`highWaterMark=16`
*	`encoding=null`
*	`allowHalfOpen=true`
* 	`objectMode=false`
*	`decodeStrings=true`

To set the `options` when creating a stream,

``` javascript
var opts = {
		'encoding': 'utf8',
		'highWaterMark': 8,
		'allowHalfOpen': false,
		'objectMode': true,
		'decodeStrings': false
	};

stream = append( '\n', opts );
```


#### append.factory( [options] )

Returns a reusable stream factory. The factory method ensures streams are configured identically by using the same set of provided `options`.

``` javascript
var opts = {
		'encoding': 'utf8',
		'highWaterMark': 8,
		'allowHalfOpen': false,
		'objectMode': true,
		'decodeStrings': false
	};

var factory = append.factory( opts );

var streams = new Array( 10 );

// Create many streams configured identically but may each be independently written to...
for ( var i = 0; i < streams.length; i++ ) {
	streams[ i ] = factory();
}
```


#### append.objectMode( [options] )

This method is a convenience function to create transform streams which always operate in `objectMode`. The method will __always__ override the `objectMode` option in `options`.

``` javascript
var fromArray, append;

fromArray = require( 'flow-from-array' ).objectMode;
append = require( 'flow-append' ).objectMode;

fromArray( ['1','2','3','4'] )
	.pipe( append( '\n' ) )
	.pipe( process.stdout );
```


## Examples

``` javascript
var toString = require( 'flow-to-string' ),
	fromArray = require( 'flow-from-array' ),
	append = require( 'flow-append' ).objectMode;

// Create some data...
var data = new Array( 1000 );
for ( var i = 0; i < data.length; i++ ) {
	data[ i ] = Math.random();
}

// Create a readable stream:
var readableStream = fromArray( data );

// Pipe the data:
readableStream
	.pipe( toString() )
	.pipe( append( '\n' ) )
	.pipe( process.stdout );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Notes

This stream is best used with binary or object streams where each datum is a character `string`. Internally, each datum is coerced to a `string` and the `value` appended. Such behavior may have undesired side-effects when used with non-string data. For example,

``` javascript
var obj = {
	'beep': 'boop'	
};

console.log( obj.toString() );
// returns '[object Object]'

var arr = [1,2,3,4];

console.log( arr.toString() );
// returns '1,2,3,4'
```

If you want to append values to an `array`, you are probably best using some other means.

If the value `undefined` is written to the stream, the stream emits an `error` event and closes.

The primary use case is in delineating successive values; e.g., separating each value with a newline character or a comma. Undoubtedly, this stream can be used for other ends, but note that no guarantees can be made concerning behavior, as in the examples above.


## Tests

### Unit

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ open reports/coverage/lcov-report/index.html
```


## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/flow-append.svg
[npm-url]: https://npmjs.org/package/flow-append

[travis-image]: http://img.shields.io/travis/flow-io/append-node/master.svg
[travis-url]: https://travis-ci.org/flow-io/append-node

[coveralls-image]: https://img.shields.io/coveralls/flow-io/append-node/master.svg
[coveralls-url]: https://coveralls.io/r/flow-io/append-node?branch=master

[dependencies-image]: http://img.shields.io/david/flow-io/append-node.svg
[dependencies-url]: https://david-dm.org/flow-io/append-node

[dev-dependencies-image]: http://img.shields.io/david/dev/flow-io/append-node.svg
[dev-dependencies-url]: https://david-dm.org/dev/flow-io/append-node

[github-issues-image]: http://img.shields.io/github/issues/flow-io/append-node.svg
[github-issues-url]: https://github.com/flow-io/append-node/issues