## jQuery-contextMenuRtl ##
jQuery-contextMenuRtl is rtl support for [jQuery-contextMenu](https://github.com/swisnl/jQuery-contextMenu)

__IMPORTANT: jQuery 3.x.x bracks jQuery UI position. make sure your jQuery version is lower then 3.0.0__

## Installation ##
```html
  style:
    <link rel="stylesheet" href="path_to/jquery.contextMenu.css" />
    <link rel="stylesheet" href="path_to/jquery.contextMenuRtl.css" />
  
  js:
    <script src="path_to/jquery.js"></script>
    <script src="path_to/jquery-ui.js"></script>
    <script src="path_to/jquery.contextMenu.js"></script>
    <script src="path_to/jquery.contextMenuRtl.js"></script>
```   
or via bower: <br/> 
``` 
    bower install jQuery-contextMenuRtl --save 
```

## Dependencies ##

* jQuery >=1.8.x <3.0.0
* jQuery UI position  
* jQuery-contextMenu

## Usage ##

register contextMenu from javascript and set rtl to true :

```javascript
$.contextMenu({
    // define which elements trigger this menu
    selector: ".context-menu-selector",
    //if rtl is set to true context menu and sub menues will be opened from right to left
    rtl:true
    // define the elements of the menu
    items: {
        foo: {name: "Foo", callback: function(key, opt){ alert("Foo!"); }},
        bar: {name: "Bar", callback: function(key, opt){ alert("Bar!") }}
    }
    // there's more, have a look at the demos and docs...
});
```

## Style ##
you can edit rtl style by using rtl selector

```css
.context-menu-root[dir="rtl"]{
    //custom style here
}
```

## Authors ##

* [Avi Meslati](https://github.com/avim101)
