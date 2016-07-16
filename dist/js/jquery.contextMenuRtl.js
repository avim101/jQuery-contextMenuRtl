/**
 * @preserve
 * jQuery contextMenuRtl v0.1.0 - rtl Plugin for contextMenu (http://swisnl.github.io/jQuery-contextMenu/) plugin
 *
 * Version: v0.1.0
 *
 * Authors: Avi Meslati
 * Web: http://github.com/avim101/jQuery-contextMenuRtl
 *
 * Copyright (c) 2016 Avi Meslati
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 * Date: 2016-06-16 15:42:56
 */

'use strict';
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node / CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals.
    factory(jQuery);
  }
})(function ($) {
  var handle = $.contextMenu.handle,
    types = $.contextMenu.types,
    op = $.contextMenu.op;

  // split accesskey according to http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#assigned-access-key
  function splitAccesskey(val) {
    var t = val.split(/\s+/),
      keys = [];

    for (var i = 0, k; k = t[i]; i++) {
      k = k.charAt(0).toUpperCase(); // first character only
      // theoretically non-accessible characters should be ignored, but different systems, different keyboard layouts, ... screw it.
      // a map to look up already used access keys would be nice
      keys.push(k);
    }

    return keys;
  }
  // find <label for="xyz">
  function inputLabel(node) {
    return (node.id && $('label[for="' + node.id + '"]').val()) || node.name;
  }
// convert <menu> to items object
  function menuChildren(items, $children, counter) {
    if (!counter) {
      counter = 0;
    }

    $children.each(function () {
      var $node = $(this),
        node = this,
        nodeName = this.nodeName.toLowerCase(),
        label,
        item;

      // extract <label><input>
      if (nodeName === 'label' && $node.find('input, textarea, select').length) {
        label = $node.text();
        $node = $node.children().first();
        node = $node.get(0);
        nodeName = node.nodeName.toLowerCase();
      }

      /*
       * <menu> accepts flow-content as children. that means <embed>, <canvas> and such are valid menu items.
       * Not being the sadistic kind, $.contextMenu only accepts:
       * <command>, <menuitem>, <hr>, <span>, <p> <input [text, radio, checkbox]>, <textarea>, <select> and of course <menu>.
       * Everything else will be imported as an html node, which is not interfaced with contextMenu.
       */

      // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#concept-command
      switch (nodeName) {
        // http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#the-menu-element
        case 'menu':
          item = {name: $node.attr('label'), items: {}};
          counter = menuChildren(item.items, $node.children(), counter);
          break;

        // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-a-element-to-define-a-command
        case 'a':
        // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-button-element-to-define-a-command
        case 'button':
          item = {
            name: $node.text(),
            disabled: !!$node.attr('disabled'),
            callback: (function () {
              return function () {
                $node.click();
              };
            })()
          };
          break;

        // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-command-element-to-define-a-command

        case 'menuitem':
        case 'command':
          switch ($node.attr('type')) {
            case undefined:
            case 'command':
            case 'menuitem':
              item = {
                name: $node.attr('label'),
                disabled: !!$node.attr('disabled'),
                icon: $node.attr('icon'),
                callback: (function () {
                  return function () {
                    $node.click();
                  };
                })()
              };
              break;

            case 'checkbox':
              item = {
                type: 'checkbox',
                disabled: !!$node.attr('disabled'),
                name: $node.attr('label'),
                selected: !!$node.attr('checked')
              };
              break;
            case 'radio':
              item = {
                type: 'radio',
                disabled: !!$node.attr('disabled'),
                name: $node.attr('label'),
                radio: $node.attr('radiogroup'),
                value: $node.attr('id'),
                selected: !!$node.attr('checked')
              };
              break;

            default:
              item = undefined;
          }
          break;

        case 'hr':
          item = '-------';
          break;

        case 'input':
          switch ($node.attr('type')) {
            case 'text':
              item = {
                type: 'text',
                name: label || inputLabel(node),
                disabled: !!$node.attr('disabled'),
                value: $node.val()
              };
              break;

            case 'checkbox':
              item = {
                type: 'checkbox',
                name: label || inputLabel(node),
                disabled: !!$node.attr('disabled'),
                selected: !!$node.attr('checked')
              };
              break;

            case 'radio':
              item = {
                type: 'radio',
                name: label || inputLabel(node),
                disabled: !!$node.attr('disabled'),
                radio: !!$node.attr('name'),
                value: $node.val(),
                selected: !!$node.attr('checked')
              };
              break;

            default:
              item = undefined;
              break;
          }
          break;

        case 'select':
          item = {
            type: 'select',
            name: label || inputLabel(node),
            disabled: !!$node.attr('disabled'),
            selected: $node.val(),
            options: {}
          };
          $node.children().each(function () {
            item.options[this.value] = $(this).text();
          });
          break;

        case 'textarea':
          item = {
            type: 'textarea',
            name: label || inputLabel(node),
            disabled: !!$node.attr('disabled'),
            value: $node.val()
          };
          break;

        case 'label':
          break;

        default:
          item = {type: 'html', html: $node.clone(true)};
          break;
      }

      if (item) {
        counter++;
        items['key' + counter] = item;
      }
    });

    return counter;
  }

  $.contextMenu.op.create = function (opt, root) {
    if (root === undefined) {
      root = opt;
    }
    // create contextMenu
    opt.$menu = $('<ul class="context-menu-list"></ul>').addClass(opt.className || '').data({
      'contextMenu': opt,
      'contextMenuRoot': root
    });

    $.each(['callbacks', 'commands', 'inputs'], function (i, k) {
      opt[k] = {};
      if (!root[k]) {
        root[k] = {};
      }
    });

    if(!root.accesskeys){
      root.accesskeys = {};
    }

    function createNameNode(item) {
      var $name = $('<span></span>');
      if (item._accesskey) {
        if (item._beforeAccesskey) {
          $name.append(document.createTextNode(item._beforeAccesskey));
        }
        $('<span></span>')
          .addClass('context-menu-accesskey')
          .text(item._accesskey)
          .appendTo($name);
        if (item._afterAccesskey) {
          $name.append(document.createTextNode(item._afterAccesskey));
        }
      } else {
        if (item.isHtmlName) {
          // restrict use with access keys
          if (typeof item.accesskey !== 'undefined') {
            throw new Error('accesskeys are not compatible with HTML names and cannot be used together in the same item');
          }
          $name.html(item.name);
        } else {
          $name.text(item.name);
        }
      }
      return $name;
    }

    // create contextMenu items
    $.each(opt.items, function (key, item) {
      var $t = $('<li class="context-menu-item"></li>').addClass(item.className || ''),
        $label = null,
        $input = null;

      // iOS needs to see a click-event bound to an element to actually
      // have the TouchEvents infrastructure trigger the click event
      $t.on('click', $.noop);

      // Make old school string seperator a real item so checks wont be
      // akward later.
      if (typeof item === 'string') {
        item = { type : 'cm_seperator' };
      }

      item.$node = $t.data({
        'contextMenu': opt,
        'contextMenuRoot': root,
        'contextMenuKey': key
      });

      // register accesskey
      // NOTE: the accesskey attribute should be applicable to any element, but Safari5 and Chrome13 still can't do that
      if (typeof item.accesskey !== 'undefined') {
        var aks = splitAccesskey(item.accesskey);
        for (var i = 0, ak; ak = aks[i]; i++) {
          if (!root.accesskeys[ak]) {
            root.accesskeys[ak] = item;
            var matched = item.name.match(new RegExp('^(.*?)(' + ak + ')(.*)$', 'i'));
            if (matched) {
              item._beforeAccesskey = matched[1];
              item._accesskey = matched[2];
              item._afterAccesskey = matched[3];
            }
            break;
          }
        }
      }

      if (item.type && types[item.type]) {
        // run custom type handler
        types[item.type].call($t, item, opt, root);
        // register commands
        $.each([opt, root], function (i, k) {
          k.commands[key] = item;
          if ($.isFunction(item.callback)) {
            k.callbacks[key] = item.callback;
          }
        });
      } else {
        // add label for input
        if (item.type === 'cm_seperator') {
          $t.addClass('context-menu-separator ' + root.classNames.notSelectable);
        } else if (item.type === 'html') {
          $t.addClass('context-menu-html ' + root.classNames.notSelectable);
        } else if (item.type) {
          $label = $('<label></label>').appendTo($t);
          createNameNode(item).appendTo($label);

          $t.addClass('context-menu-input');
          opt.hasTypes = true;
          $.each([opt, root], function (i, k) {
            k.commands[key] = item;
            k.inputs[key] = item;
          });
        } else if (item.items) {
          item.type = 'sub';
        }

        switch (item.type) {
          case 'cm_seperator':
            break;

          case 'text':
            $input = $('<input type="text" value="1" name="" value="">')
              .attr('name', 'context-menu-input-' + key)
              .val(item.value || '')
              .appendTo($label);
            break;

          case 'textarea':
            $input = $('<textarea name=""></textarea>')
              .attr('name', 'context-menu-input-' + key)
              .val(item.value || '')
              .appendTo($label);

            if (item.height) {
              $input.height(item.height);
            }
            break;

          case 'checkbox':
            $input = $('<input type="checkbox" value="1" name="" value="">')
              .attr('name', 'context-menu-input-' + key)
              .val(item.value || '')
              .prop('checked', !!item.selected)
              .prependTo($label);
            break;

          case 'radio':
            $input = $('<input type="radio" value="1" name="" value="">')
              .attr('name', 'context-menu-input-' + item.radio)
              .val(item.value || '')
              .prop('checked', !!item.selected)
              .prependTo($label);
            break;

          case 'select':
            $input = $('<select name="">')
              .attr('name', 'context-menu-input-' + key)
              .appendTo($label);
            if (item.options) {
              $.each(item.options, function (value, text) {
                $('<option></option>').val(value).text(text).appendTo($input);
              });
              $input.val(item.selected);
            }
            break;

          case 'sub':
            createNameNode(item).appendTo($t);

            item.appendTo = item.$node;
            op.create(item, root);
            $t.data('contextMenu', item).addClass('context-menu-submenu');
            item.callback = null;
            break;

          case 'html':
            $(item.html).appendTo($t);
            break;

          default:
            $.each([opt, root], function (i, k) {
              k.commands[key] = item;
              if ($.isFunction(item.callback)) {
                k.callbacks[key] = item.callback;
              }
            });
            createNameNode(item).appendTo($t);
            break;
        }

        // disable key listener in <input>
        if (item.type && item.type !== 'sub' && item.type !== 'html' && item.type !== 'cm_seperator') {
          $input
            .on('focus', handle.focusInput)
            .on('blur', handle.blurInput);

          if (item.events) {
            $input.on(item.events, opt);
          }
        }

        // add icons
        if (item.icon) {
          if ($.isFunction(item.icon)) {
            item._icon = item.icon.call(this, this, $t, key, item);
          } else {
            if ( typeof(item.icon) === 'string' && item.icon.substring(0,3) == 'fa-' ) {
              // to enable font awesome
              item._icon = root.classNames.icon + ' ' + root.classNames.icon + '--fa fa ' + item.icon;
            } else {
              item._icon = root.classNames.icon + ' ' + root.classNames.icon + '-' + item.icon;
            }
          }
          $t.addClass(item._icon);
        }
      }

      // cache contained elements
      item.$input = $input;
      item.$label = $label;

      // attach item to menu
      $t.appendTo(opt.$menu);

      // Disable text selection
      if (!opt.hasTypes && $.support.eventSelectstart) {
        // browsers support user-select: none,
        // IE has a special event for text-selection
        // browsers supporting neither will not be preventing text-selection
        $t.on('selectstart.disableTextSelect', handle.abortevent);
      }
    });
    // attach contextMenu to <body> (to bypass any possible overflow:hidden issues on parents of the trigger element)
    if (!opt.$node) {
      opt.$menu.css('display', 'none').addClass('context-menu-root');
      //if opt rtl is true attach dir="rtl" for styling
      if(opt.rtl && opt.rtl === true){
        opt.$menu.attr("dir","rtl");
      }
    }
    opt.$menu.appendTo(opt.appendTo || document.body);
  };
  $.contextMenu.defaults.positionSubmenu = function ($menu,rtl) {
    if ($.ui && $.ui.position) {
      // .position() is provided as a jQuery UI utility
      // (...and it won't work on hidden elements)
      //if rtl is true opn sub menu from right to left
      $menu.css('display', 'block').position({
        my: rtl === true ? 'right top' : 'left top',
        at: rtl === true ? 'left top' : 'right top',
        of: this,
        collision: 'flipfit fit'
      }).css('display', '');
    } else {
      // determine contextMenu position
      var offset = {
        top: 0,
        left: this.outerWidth()
      };
      $menu.css(offset);
    }
  };
  $.contextMenu.handle.focusItem = function (e) {
    e.stopPropagation();
    var $this = $(this),
      data = $this.data(),
      opt = data.contextMenu,
      root = data.contextMenuRoot;
    // console.log(opt);

    if ($this.hasClass(root.classNames.disabled) || $this.hasClass(root.classNames.notSelectable)) {
      return;
    }

    $this
      .addClass([root.classNames.hover, root.classNames.visible].join(' '))
      // select other items and included items
      .parent().find('.context-menu-item').not($this)
      .removeClass(root.classNames.visible)
      .filter('.' + root.classNames.hover)
      .trigger('contextmenu:blur');

    // remember selected
    opt.$selected = root.$selected = $this;

    // position sub-menu - do after show so dumb $.ui.position can keep up
    if (opt.$node) {
      root.positionSubmenu.call(opt.$node, opt.$menu, root.rtl);
    }
  };
});
