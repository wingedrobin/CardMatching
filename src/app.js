"use strict" ;

var comp = gxd.comp || { } ;

var HelloWorldScene = cc.Scene.extend(
{
	_countdownLayer	: null ,
	_mainLayer		: null ,
	_gameOverLayer	: null ,
	_startTime		: null ,
	
	ctor : function( )
	{
        this._super( ) ;
	} ,
	
    onEnter:function( )
	{
        this._super( ) ;
		
		this._countdownLayer = new comp.CountdownLayer( cc.color( 255 , 255 , 255 , 1 ) ,
														cc.director.getWinSize( ).width ,
														cc.director.getWinSize( ).height ) ;
		this._countdownLayer.retain( ) ;
		
        this._mainLayer = new comp.WindowFrameLayer( cc.color( 255 , 255 , 255 ) ,
													 cc.director.getWinSize( ).width ,
													 cc.director.getWinSize( ).height ,
													 4 ,
													 4 ) ;
		
        this.addChild( this._mainLayer ) ;
    } ,
	
	onEnterTransitionDidFinish : function( )
	{
		this._super( ) ;
		
		this._countdownLayer.countdown( 5 , this.gameStart.bind( this ) ) ;
	} ,
	
	gameStart : function( )
	{
		this._mainLayer.flipAllCards( ) ;
		this._startTime = new Date( ) ;
	} ,
	
	gameOver : function( complete )
	{
		var duration = ( new Date( ) - this._startTime ) / 1000 ;
		var message = String( duration ) + " 秒" ;
		
		if( this._gameOverLayer )
		{
			this.addChild( this._gameOverLayer , 10 ) ;
		}
		else
		{
			this._gameOverLayer = new comp.GameOverLayer( cc.color( 50 , 50 , 50 , 0 ) ,
														  this._mainLayer.getContentSize( ).width ,
														  this._mainLayer.getContentSize( ).height ) ;
			
			this._gameOverLayer.setPosition( this._mainLayer.getPosition( ) ) ;
			this._gameOverLayer.retain( ) ;
			this.addChild( this._gameOverLayer , 10 ) ;
		}
		
		this._gameOverLayer._setGameOverMessage( message ) ;
	} ,
	
	onLeave : function( )
	{
		cc.director.end( ) ;
	} ,
	
	onTryAgain : function( )
	{
		this._mainLayer.reset( ) ;
		this._countdownLayer.countdown( 5 , this.gameStart.bind( this ) ) ;
		this.removeChild( this._gameOverLayer ) ;
	} ,
	
	onExit : function( )
	{
		this._countdownLayer.release( ) ;
		this._countdownLayer.free( ) ;
		this._countdownLayer = null ;
	
		this._mainLayer.free( ) ;
		this._mainLayer = null ;
		
		if( this._gameOverLayer )
		{
			this._gameOverLayer.release( ) ;
			this._gameOverLayer = null ;
		}
		
		this._startTime = null ;
	}
});

