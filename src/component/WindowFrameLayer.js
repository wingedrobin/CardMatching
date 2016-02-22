/**
 *
 * @file
 * @author	Yong-Quan Chen
 * @copyright
 * @license
 */

// 2016/01/29 14:00 加入音效
// 音效來源: 小森平 http://taira-komori.jpn.org/freesoundtw.html
 
"use strict" ;

var comp	= gxd.comp || { } ;

comp.WindowFrameLayer = cc.LayerColor.extend(
/** @lends WindowFrameLayer */
{
	_className		: "WindowFrameLayer" ,
	
	_rows					: null ,
	_columns				: null ,
	_frameSize				: null ,
	_framesOriginal			: null ,
	_drawNode				: null ,
	_touchPoint				: null ,
	_moveFinished			: null ,
	_touchListener			: null ,
	_lastFlipedCard			: null ,
	_cardFlipedListener		: null ,
	_amountOfUnflippedCard	: null ,
	
	/**
	 *
	 * @
	 * @param	{cc.color}	Color of layer.
	 * @param	{number}	Width of layer.
	 * @param	{number}	Height of layer.
	 * @param	{number}	Rows of window frame.
	 * @param	{number}	Columns of window frame.
	 */
	ctor : function( color , width , height , rows , columns )
	{
		this._super( color , width , height ) ;
		
		this._rows				= rows ;
		this._columns			= columns ;
		this._framesOriginal	= [ ] ;
		// this._drawNode			= new cc.DrawNode( ) ;
		
		// this.addChild( this._drawNode ) ;
		
		this._calcFrameSize( ) ;
		this._calcFramesOriginal( ) ;
		this._createTouchListener( ) ;
		this._initCardFlippedListener( ) ;
		
		this.reset( ) ;
	} ,
	
	/**
	 * Destructor.
	 * @function
	 */
	free : function( )
	{
		// this._drawNode.clear( ) ;
		
		this._framesOriginal.length	= 0 ;
		this._framesOriginal		= null ;
		
		this._touchListener			= null ;
		this._cardFlipedListener	= null ;
		
		this._lastFlipedCard		= null ;
	
	} ,
	
	/**
	 * @function
	 */
	reset : function( )
	{
		this._lastFlipedCard		= null ;
		this._amountOfUnflippedCard	= this._rows * this._columns ;
		
		this._initCards( ) ;
	} ,
	
	/**
	 * @function
	 * @complexity	O(1)
	 */
	_calcFrameSize : function( )
	{
		var padding 	= comp.WindowFrameLayer.padding ;
		var width		= ( ( this.width - padding ) / this._columns ) - padding ;
		var height		= ( ( this.height - padding ) / this._rows ) - padding ;
		
		this._frameSize = cc.size( width , height ) ;
	} ,
	
	/**
	 * @function
	 * @complexity	O(n^2)
	 */
	_calcFramesOriginal : function( )
	{
		var position	= null ;
		var padding		= comp.WindowFrameLayer.padding ;
		
		for( var i = 0 ; i < this._rows ; i ++ )
		{
			this._framesOriginal[ i ] = [ ] ;
			
			for( var j = 0 ; j < this._columns ; j ++ )
			{
				position = cc.p( ( j + 1 ) * padding + ( j * this._frameSize.width ) ,
								 ( i + 1 ) * padding + ( i * this._frameSize.height ) ) ;
				
				this._framesOriginal[ i ][ j ] = position ;
			}
		}
	} ,
	
	getFrameSize : function( )
	{
		return this._frameSize ;
	} ,
	
	_createTouchListener : function( )
	{
		this._touchListener = cc.EventListener.create(
		{
			event				: cc.EventListener.TOUCH_ONE_BY_ONE ,
			swallowTouches		: true ,
			onTouchBegan		: this._onTouchBegan.bind( this )
		} ) ;
		
		cc.eventManager.addListener( this._touchListener , this ) ;
	} ,
	
	_initCardFlippedListener : function( )
	{
		this._cardFlipedListener = cc.EventListener.create(
		{
			event		: cc.EventListener.CUSTOM ,
			eventName	: "CARD_FLIPED" ,
			callback	: this._cardMatching.bind( this )
		} ) ;
		
		cc.eventManager.addListener( this._cardFlipedListener , 1 ) ;
	} ,
	
	_onTouchBegan : function( touch , event )
	{
		var touchedTarget	= event.getCurrentTarget( ) ;
		var locationInNode	= touchedTarget.convertToNodeSpace( touch.getLocation( ) ) ;
		var targetSize		= touchedTarget.getContentSize( ) ;
		var targetRect		= cc.rect( 0 , 0 , targetSize.width , targetSize.height ) ;
		
		if( !cc.rectContainsPoint( targetRect , locationInNode ) )
			return false ;
		
		this._moveFinished	= false ;
		this._touchPoint	= this.convertTouchToNodeSpace( touch ) ;
		
		return true ;
	} ,
	
	onEnter : function( )
	{
		this._super( ) ;
	} ,
	
	onEnterTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	_initCards : function( )
	{
		var indices = [ ] ;
		
		for( var i = 0 , amount = this._rows * this._columns ; i < amount ; i ++ )
		{
			indices.push( i ) ;
		}
		
		indices = util.shuffle( indices ) ;
		
		for( var i = 0 , amount = this._rows * this._columns ; i < amount ; i ++ )
		{
			var row		= Math.floor( indices[ i ] / this._rows ) ;
			var column	= indices[ i ] % this._rows ;
			
			var tag		= Math.floor( i / 2 ) ;
			var card	= new comp.MatchingCard( g_resources[ tag ] , res.question_png ) ;
			card.setTag( tag ) ;
			card.setName( String( i ) ) ;
			
			card.setPosition( this._framesOriginal[ row ][ column ].x + card.getContentSize( ).width * 0.5 ,
							  this._framesOriginal[ row ][ column ].y + card.getContentSize( ).height * 0.5 ) ;
			
			this.addChild( card ) ;
		}
	} ,
	
	_cardMatching : function( event )
	{
		var name = event.getUserData( ) ;
		var card = this.getChildByName( name ) ;
		
		if( this._lastFlipedCard )
		{
			if( this._lastFlipedCard.getTag( ) === card.getTag( ) )
			{
				cc.audioEngine.playEffect( res.correct_mp3 ) ;
				
				card.free( );
				card.removeFromParent( ) ;
				card = null ;
				this._lastFlipedCard.free( ) ;
				this._lastFlipedCard.removeFromParent( ) ;
				this._lastFlipedCard = null ;
				
				this._amountOfUnflippedCard -= 2 ;
				
				if( this._amountOfUnflippedCard === 0 )
				{
					this.getParent( ).gameOver( true ) ;
					cc.audioEngine.playEffect( res.clear_mp3 ) ;
				}
			}
			else
			{
				cc.audioEngine.playEffect( res.wrong_mp3 ) ;
				
				card.flip( ) ;
				this._lastFlipedCard.flip( ) ;
				this._lastFlipedCard = null ;
			}
		}
		else
		{
			this._lastFlipedCard = card ;
		}
	} ,
	
	flipAllCards : function( )
	{
		var children = this.getChildren( ) ;
		
		for( var child of children )
			if( child.flip )
				child.flip( ) ;
	} ,
	
	onExitTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	onExit : function( )
	{
		this._super( ) ;
		
		cc.eventManager.removeListener( this._touchListener ) ;
		cc.eventManager.removeListener( this._cardFlipedListener ) ;
		
		this._drawNode.clear( ) ;
		this.free( ) ;
		this.removeAllChildren( ) ;
	}
} ) ;

Object.defineProperty( comp.WindowFrameLayer , "padding" ,
{
	value		: 0 ,
	enumerable	: true
} ) ;