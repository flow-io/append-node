
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Transform stream class:
	Transform = require( 'readable-stream' ).Transform,

	// Mock writing to a stream:
	mockWrite = require( 'flow-mock-write' ),

	// Mock reading from a stream:
	mockRead = require( 'flow-mock-read' ),

	// Module to be tested:
	stream = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'flow-append', function tests() {
	'use strict';

	describe( 'class', function tests() {

		it( 'should export a function', function test() {
			expect( stream ).to.be.a( 'function' );
		});

		it( 'should throw an error if provided a bad option', function test() {
			expect( foo ).to.throw( TypeError );

			function foo() {
				stream('beep',{'objectMode': []});
			}
		});

		it( 'should return a transform stream', function test() {
			var opts = {
					'encoding': 'utf8',
					'objectMode': true,
					'highWaterMark': 16,
					'allowHalfOpen': true,
					'decodeStrings': false
				};
			assert.instanceOf( stream( 'beep', opts ), Transform );
		});

		it( 'should append to each data string when in object mode', function test( done ) {
			var data = [ 'beep' ],
				expected = [ 'beepboop' ],
				s;

			s = stream( 'boop', {
				'objectMode': true
			});

			mockRead( s, onData );
			mockWrite( data, s );

			function onData( error, actual ) {
				if ( error ) {
					assert.notOk( true );
					return;
				}
				assert.deepEqual( expected, actual );
				done();
			}
		});

		it( 'should throw an error if piped data which is not string-able while in object mode', function test( done ) {
			var data = [ undefined ],
				s;

			s = stream( 'boop', {
				'objectMode': true
			});

			mockRead( s, onError );
			mockWrite( data, s );

			function onError( error ) {
				assert.ok( true );
				done();
			}
		});

		it( 'should append to each stream buffer when in not object mode', function test( done ) {
			var data = [ new Buffer('beep') ],
				expected = [ 'beepboop' ];

			var s = stream( 'boop' );

			mockRead( s, onData );
			mockWrite( data, s );

			function onData( error, actual ) {
				if ( error ) {
					assert.notOk( true );
					return;
				}
				for ( var i = 0; i < actual.length; i++ ) {
					actual[ i ] = actual[ i ].toString();
				}
				assert.deepEqual( expected, actual );
				done();
			}
		});

		it( 'can be destroyed', function test( done ) {
			var s = stream();
			s.on( 'close', function onClose() {
				assert.ok( true );
				done();
			});
			s.destroy();
		});

		it( 'can be destroyed more than once', function test( done ) {
			var s = stream();
			s.on( 'close', function onClose() {
				assert.ok( true );
				done();
			});
			s.destroy();
			s.destroy();
		});

		it( 'can be destroyed with an error', function test( done ) {
			var s = stream();
			s.on( 'error', function onError( error ) {
				if ( error ) {
					assert.ok( true );
					return;
				}
				assert.notOk( true );
			});
			s.on( 'close', function onClose() {
				assert.ok( true );
				done();
			});
			s.destroy( new Error('beep') );
		});

	});

	describe( 'objectMode', function tests() {

		it( 'should export a function to create streams only operating in objectMode', function test() {
			expect( stream.objectMode ).to.be.a( 'function' );
		});

		it( 'should return a stream in object mode', function test( done ) {
			var Stream = stream,
				append = stream.objectMode,
				opts,
				s,
				data,
				expected;

			// Returns Stream instance:
			assert.instanceOf( append( '\n' ), Stream );

			// Sets the objectMode option:
			opts = {
				'objectMode': false
			};
			s = append( '\n', opts );
			assert.strictEqual( opts.objectMode, true );

			// Behaves as expected:
			data = ['a','b','c','d'];
			expected = ['a1', 'b1', 'c1', 'd1' ];

			s = append( '1' );
			mockWrite( data, s );
			mockRead( s, onData );

			function onData( error, actual ) {
				if ( error ) {
					assert.notOk( true );
					return;
				}
				assert.deepEqual( expected, actual );
				done();
			}
		});

	});

	describe( 'factory', function tests() {

		it( 'should export a reusable stream factory', function test() {
			expect( stream.factory ).to.be.a('function' );
			expect( stream.factory() ).to.be.a( 'function' );
		});

		it( 'should return a stream from the factory', function test() {
			var Stream = stream,
				opts = {'objectMode': true},
				factory = stream.factory( opts );

			assert.instanceOf( factory( '\n' ), Stream );
		});

	});

});