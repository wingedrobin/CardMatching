"use strict" ;

var util = util || { } ;

/**
 *
 * @function	
 * @param		{number}	Upper bound.
 * @param		{number}	Lower bound.
 * @return		{number}	Random number between min and max.
 */
util.randomBetween = function( max , min )
{
	return Math.random( ) * ( max - min ) + min ;
} ;

util.shuffle = function( source )
{
	var i		= source.length ;
	var random	= null ;
	var temp	= null ;
	
	while( i )
	{
		random				= Math.floor( Math.random( ) * i ) ;
		temp				= source[ -- i ] ;
		source[ i ]			= source[ random ] ;
		source[ random ]	= temp ;
	}
	
	return source ;
} ;