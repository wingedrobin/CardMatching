"use strict" ;

var comp = gxd.comp || { } ;

comp.MatchingCard = cc.Node.extend(
{
	_isFrontSide	: null ,
	_frontSide		: null ,
	_backSide		: null ,
	_touchListener	: null ,
	
	ctor : function( frontSideImagePath , backSideImagePath )
	{
		this._super( ) ;
		
		this.setAnchorPoint( 0.5 , 0.5 ) ;
		
		this._isFrontSide = true ;
		
		this._initFrontSide( frontSideImagePath ) ;
		this._initBackSide( backSideImagePath ) ;
		this._initTouchListener( ) ;
		this.setContentSize( this._frontSide.getContentSize( ) ) ;
		
		this.setName( frontSideImagePath ) ;
	} ,
	
	free : function( )
	{
		cc.eventManager.removeListener( this._touchListener ) ;
		this._touchListener.release( ) ;
		this._touchListener = null ;
		
		this.removeAllChildren( ) ;
	} ,
	
	_initFrontSide : function( frontSideImagePath )
	{
		this._frontSide = new cc.Sprite( frontSideImagePath ) ;
		this._frontSide.setPosition( this._frontSide.getContentSize( ).width * 0.5 ,
									 this._frontSide.getContentSize( ).height * 0.5 ) ;
		
		this._frontSide.setFlippedX( true ) ;
		this.addChild( this._frontSide ) ;
	} ,
	
	_initBackSide : function( backSideImagePath )
	{
		this._backSide = new cc.Sprite( backSideImagePath ) ;
		this._backSide.setPosition( this._backSide.getContentSize( ).width * 0.5 ,
									this._backSide.getContentSize( ).height * 0.5 ) ;
		this._backSide.setVisible( false ) ;
		this.addChild( this._backSide ) ;
	} ,
	
	_initTouchListener : function( )
	{
		this._touchListener = cc.EventListener.create(
		{
			event			: cc.EventListener.TOUCH_ONE_BY_ONE ,
			swallowTouches	: true ,
			onTouchBegan	: this._onTouchBagan.bind( this )
		} ) ;
		
		this._touchListener.retain( ) ;
		// cc.eventManager.addListener( this._touchListener , this ) ;
	} ,
	
	_switchSide : function( )
	{
		this._backSide.setVisible( !this._backSide.isVisible( ) ) ;
		this._frontSide.setVisible( !this._frontSide.isVisible( ) ) ;
	} ,
	
	_flipDone : function( )
	{
		this._isFrontSide = !this._isFrontSide ;
		
		if( this._isFrontSide )
		{
			var event = new cc.EventCustom( "CARD_FLIPED" ) ;
			// event.setUserData( this ) ;
			event.setUserData( this.getName( ) ) ;
			cc.eventManager.dispatchEvent( event ) ;
			
			cc.eventManager.removeListener( this._touchListener ) ;
		}
		else
		{
			cc.eventManager.addListener( this._touchListener , this ) ;
		}
	} ,
	
	flip : function( )
	{
		var degree	= this._isFrontSide ? 0 : 180 ;
		var delay	= this._isFrontSide ? 0 : 0.5 ;
		
		this.runAction( cc.sequence( cc.rotateTo( 0.15 , 0 , 90 ) ,
									 cc.callFunc( this._switchSide , this ) ,
									 cc.rotateTo( 0.15 , 0 , degree ) ,
									 cc.delayTime( delay ) ,
									 cc.callFunc( this._flipDone , this ) ) ) ;
	} ,
	
	_onTouchBagan : function( touch , event )
	{
		var touchedTarget	= event.getCurrentTarget( ) ;
		var locationInNode	= touchedTarget.convertToNodeSpace( touch.getLocation( ) ) ;
		var targetSize		= touchedTarget.getContentSize( ) ;
		var targetRect		= cc.rect( 0 , 0 , targetSize.width , targetSize.height ) ;
		
		if( !cc.rectContainsPoint( targetRect , locationInNode ) )
			return false ;
		
		this._moveFinished	= false ;
		this._touchPoint	= this.convertTouchToNodeSpace( touch ) ;
		
		this.flip( ) ;
		
		return true ;
	}
} ) ;