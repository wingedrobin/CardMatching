"use strict" ;

var comp = gxd.comp || { } ;

comp.CountdownLayer = comp.TouchBlockedLayer.extend(
{
	_timeout			: null ,
	_duration			: null ,
	_numberLabel		: null ,
	_timeoutCallback	: null ,
	
	ctor : function( color , width , height )
	{
		this._super( color , width , height ) ;
		
		this._numberLabel = new cc.LabelTTF( ) ;
		this._numberLabel.setPosition( this.getContentSize( ).width * 0.5 ,
									   this.getContentSize( ).height * 0.5 ) ;
		
		this._numberLabel.setFontFillColor( cc.color( 143 , 121 , 100 , 150 ) ) ;
		this._numberLabel.setFontSize( 200 ) ;
		this._numberLabel.setTag( 1 ) ;
		this.addChild( this._numberLabel ) ;
	} ,
	
	countdown : function( time , callback )
	{
		this._timeout			= time ;
		this._timeoutCallback	= callback ;
		
		cc.director.getRunningScene( ).addChild( this , 10 ) ;
		
		this.schedule( this._countdown.bind( this ) ,
					   1 ,
					   this._timeout ,
					   0 ) ;
	} ,
	
	_countdown : function( )
	{
		this._numberLabel.setString( this._timeout ) ;
		this._numberLabel.runAction( cc.sequence( cc.scaleTo( 0.3 , 2 , 2 ) ,
												  cc.fadeOut( 0.3 ) ) ) ;
		
		this._numberLabel.setOpacity( 255 ) ;
		this._numberLabel.setScale( 1 , 1 ) ;
		
		if( this._timeout === 0 )
		{
			this._numberLabel.setString( "" ) ;
			this.removeFromParent( ) ;
			this._timeoutCallback( ) ;
		}
		
		this._timeout -- ;
	}
} ) ;