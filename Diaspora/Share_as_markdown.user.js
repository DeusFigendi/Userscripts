// ==UserScript==
// @name        Share as markdown (a)
// @namespace   deusfigendi
// @description Generates "share as markdown"-buttons on pixabay, wikicommons and deviantart.
// @include     https://pixabay.com/*/*
// @include     https://commons.wikimedia.org/wiki/File*
// @include     http://*.deviantart.com/art/*
// @version     1.0
// @grant       none
// ==/UserScript==


function createSharebutton() {
  //version: 1.0
  var markdownsharebutton = document.createElement('div');
  markdownsharebutton.id = 'markdownsharebutton';
  markdownsharebutton.style.width = '50px';
  markdownsharebutton.style.height = '50px';
  markdownsharebutton.style.position = 'fixed';
  markdownsharebutton.style.top = '50px';
  markdownsharebutton.style.left = '50px';
  markdownsharebutton.style.backgroundColor = '#222';
  markdownsharebutton.style.color = '#fff';
  markdownsharebutton.style.textAlign = 'center';
  markdownsharebutton.style.verticalAlign = 'middle';
  markdownsharebutton.style.fontSize = '50px';
  markdownsharebutton.style.cursor = 'pointer';
  markdownsharebutton.style.zIndex = '60';
  markdownsharebutton.appendChild(document.createTextNode('*'));
  document.getElementsByTagName('body') [0].appendChild(markdownsharebutton);
  return (markdownsharebutton);
}


function deviantart_add_sharebutton() {
  var markdownsharebutton = createSharebutton();
  if (location.hash == '#markdownshare_fire') {
    deviantart_do_sharebutton();
  }
  
  markdownsharebutton.addEventListener('click', function () {deviantart_do_sharebutton(); }, false);
    
}

function deviantart_do_sharebutton() {
  
    if (document.querySelector('#output').style.display == "none") {
      //reload page if there is ajax-content.
      location.href += '#markdownshare_fire';
      location.reload();
    }
    
    //okay, collect usefull information from the website and handover to the copy-box-thingy…
    
    //Title:
    var page_title = document.querySelector('.dev-title-container h1 a').textContent;
    
    //Image itself:
    var image_url = document.querySelector('.dev-view-deviation img').src;
    var image_alt_text = document.querySelector('.dev-description div.text.block').textContent;
    
    //Link to the page we are looking at…
    var page_url = window.location.href;
    
    //Author:
    var image_author = document.querySelector('.dev-title-container .username').textContent;
    var image_author_url = document.querySelector('.dev-title-container a.username').href;
    
    //License…
    var licence_url = document.querySelector('.cc_license_text a');
    if (licence_url != null) {
      licence_url = licence_url.href;
    }
    
    //Tags
    var tag_list = new Array();
    //all categories + all groups
    var cat_as = document.querySelectorAll(".dev-about-cat-cc a");
    for (var i=0; i<cat_as.length; i++) {
      tag_list.push(cat_as[i].textContent.replace(/\s/g, ''));
    }
    
    cat_as = document.querySelectorAll(".group_featured_list span.grpname");    
    for (var i=0; i<cat_as.length; i++) {
      tag_list.push(cat_as[i].textContent.replace(/\s/g, ''));
    }
    
    cat_as = document.querySelectorAll(".more-from-collection-preview a.collection-name");    
    for (var i=0; i<cat_as.length; i++) {
      tag_list.push(cat_as[i].textContent.replace(/\s/g, ''));
    }
    
    var markdown_content = generate_markdown1(new Array(page_title, page_url), new Array(image_url, image_alt_text.replace(/\s/g, ' '), page_url), image_alt_text, new Array(image_author, image_author_url), licence_url, tag_list);
    markdown_output(markdown_content);
}

function wikimedia_add_sharebutton() {
  var markdownsharebutton = createSharebutton();
  markdownsharebutton.addEventListener('click', function () {
    //okay, collect usefull information from the website and handover to the copy-box-thingy…
    //Title:
    var page_title = document.title;
    //Image itself:
    //var image_url = "https://pixabay.com/en/photos/download"+document.getElementsByClassName("download_menu")[0].getElementsByTagName("input")[0].value;
    var image_list = document.getElementsByClassName('mw-thumbnail-link');
    if (image_list.length > 2) {
      var image_url = image_list[2].href;
    } else if (image_list.length > 0) {
      var image_url = image_list[0].href;
    } else {
      var image_url = document.getElementById('file').getElementsByTagName('img') [0].src;
    }
    var alt_text_td = null;
    if (document.getElementById('fileinfotpl_desc')) {
      alt_text_td = document.getElementById('fileinfotpl_desc');
    } else if (document.getElementById('fileinfotpl_art_title')) {
      alt_text_td = document.getElementById('fileinfotpl_art_title');
    }
    if (alt_text_td != null) {
      do {
        alt_text_td = alt_text_td.nextSibling;
      } while (alt_text_td.nodeName != 'TD');
      var image_alt_text = alt_text_td.innerText;
    } else {
      var image_alt_text = null;
    }    //Link to the page we are looking at…

    var page_url = window.location.href;
    //Author:
    var author_td = document.getElementById('fileinfotpl_aut');
    do {
      author_td = author_td.nextSibling;
    } while (author_td.nodeName != 'TD');
    var image_author = author_td.innerText;
    if (author_td.getElementsByTagName('a').length > 0) {
      var image_author_url = author_td.getElementsByTagName('a') [0].href;
    } else {
      var image_author_url = page_url;
    }    //License…
    /* //old code:
    // .licensetpl
    var licensetpl = document.getElementsByClassName("licensetpl");
    if (licensetpl.length) {
     var useless_count_variable = -10;
     var temp_url = "";
     var temp_int1 = 0;
     var temp_int2 = 0;
     while ( useless_count_variable < 0 ) {
       useless_count_variable++;
       temp_int1 = Math.floor(Math.random()*licensetpl.length);
       temp_int2 = Math.floor(Math.random()*licensetpl[temp_int1].getElementsByTagName("a").length);
       alert(temp_int1+" - "+temp_int2);
       temp_url = licensetpl[temp_int1].getElementsByTagName("a")[temp_int2].href;
       temp_url = get_licence_from_url(temp_url);
       if (typeof(temp_url) == "string") {
         alert(temp_url);
       } else {
         var licence_url = temp_url;
         useless_count_variable = 1;
       }       
      }
    } else {
      //there is no .licensetpl
    }
    */

    if (document.getElementsByClassName('licensetpl_link').length > 0) {
      var licence_url = document.getElementsByClassName('licensetpl_link') [Math.floor(Math.random() * document.getElementsByClassName('licensetpl_link').length)].innerText;
    } else if (document.getElementsByClassName('licensetpl_short').length > 0) {
      var licence_url = document.getElementsByClassName('licensetpl_short') [Math.floor(Math.random() * document.getElementsByClassName('licensetpl_short').length)].innerText;
      if (licence_url == 'Public domain') {
        licence_url = 'https://en.wikipedia.org/wiki/en:public_domain';
      } else {
        licence_url = null;
      }
    } else {
      var licence_url = null;
    }    //Tags

    var tag_list = new Array();
    for (var i = 0; i < document.getElementById('catlinks').getElementsByTagName('ul') [0].getElementsByTagName('li').length; i++) {
      tag_list.push(document.getElementById('catlinks').getElementsByTagName('ul') [0].getElementsByTagName('li') [i].getElementsByTagName('a') [0].innerText.replace(/\s/g, '').replace(/\([^\)]*\)/g, ''));
    }
    if (tag_list[tag_list.length - 1] == '(+)') {
      tag_list.pop();
    }
    var markdown_content = generate_markdown1(new Array(page_title, page_url), new Array(image_url, image_alt_text.replace(/\s/g, ' '), page_url), image_alt_text, new Array(image_author, image_author_url), licence_url, tag_list);
    markdown_output(markdown_content);
  }, false);
}

function pixabay_add_sharebutton() {
  var markdownsharebutton = createSharebutton();
  markdownsharebutton.addEventListener('click', function () {
    //okay, collect usefull information from the website and handover to the copy-box-thingy…
    //Title:pixabay images don't have a title it seeems.
    //Image itself:
    //var image_url = "https://pixabay.com/en/photos/download"+document.getElementsByClassName("download_menu")[0].getElementsByTagName("input")[0].value;
    var image_element = document.getElementById('media_container').getElementsByTagName('img')[0];
    
    var temp_canvas = document.createElement("canvas");
    temp_canvas.height = Math.round(image_element.height*0.4);
    temp_canvas.width = Math.round(image_element.width*0.4);
    var temp_canvas_context = temp_canvas.getContext('2d');
    temp_canvas_context.drawImage(image_element,Math.round(image_element.width*0.2),Math.round(image_element.height*0.2),Math.round(image_element.width*0.8),Math.round(image_element.height*0.8),0,0,Math.round(image_element.width*0.4),Math.round(image_element.height*0.4));
    var image_url = temp_canvas.toDataURL("image/jpeg", 0.5);
    
    var image_alt_text = document.getElementById('media_container').getElementsByTagName('img') [0].getAttribute('alt');
    //Link to the page we are looking at…
    var page_url = window.location.href;
    //Author:
    var image_author = document.getElementById('follow_button').parentNode.getElementsByTagName('a') [1].firstChild.data.match(/[^\/]*/) [0].trim();
    var image_author_url = document.getElementById('follow_button').parentNode.getElementsByTagName('a') [1].href;
    //License…
    var licence_url = document.getElementById('media_container').getElementsByTagName('meta') [0].getAttribute('content');
    //Tags
    var tag_list = new Array();
    for (var i = 0; i < document.getElementsByClassName('tags') [0].getElementsByTagName('a').length; i++) {
      tag_list.push(document.getElementsByClassName('tags') [0].getElementsByTagName('a') [i].firstChild.data.replace(/\s/g, ''));
    }
    var markdown_content = generate_markdown1(null, new Array(image_url, image_alt_text, page_url), null, new Array(image_author, image_author_url), licence_url, tag_list);
    markdown_output(markdown_content);
  }, false);
}

function markdown_output(md_s) {
  //version: 1.0
  if (document.getElementById('output_box') == null) {
    var output_box = document.createElement('div');
    output_box.id = 'output_box';
    output_box.style.position = 'fixed';
    output_box.style.textAlign = 'right';
    output_box.style.left = '40px';
    output_box.style.top = '40px';
    output_box.style.backgroundColor = '#666';
    output_box.style.padding = '15px';
    output_box.style.zIndex = '66';
    var output_close = document.createElement('span');
    output_close.style.fontWeight = 'bold';
    output_close.style.cursor = 'pointer';
    output_close.appendChild(document.createTextNode('X'));
    output_close.addEventListener('click', function () {
      this.parentNode.style.display = 'none';
    }, true);
    output_box.appendChild(output_close);
    var output_area = document.createElement('textarea');
    output_area.id = 'output_area';
    output_area.style.display = 'block';
    output_area.rows = 10;
    output_area.cols = 40;
    output_area.style.fontSize = 'small';
    output_box.appendChild(output_area);
    output_area.value = md_s;
    document.getElementsByTagName('body') [0].appendChild(output_box);
  } else {
    document.getElementById('output_box').style.display = 'block';
    document.getElementById('output_area').value = md_s;
  }
}

function generate_markdown1(my_title, my_image, my_description, my_author, my_license, my_taglist) {  
  //version: 1.0
  //title might be null or string or array(Title,URL)
  //image might be string(url) or array(image-url,link-url) or array(image-url,alt-text,link-url)
  //description should be string(markdown)
  //author might be string(authors name) or array(authors name, link)
  //license should be string(url) and might be null or string(license name) or array(complete markdown) or array(license name, license link) or array(license name, license image-url, license link-url)
  //taglist should be an array of strings and might be a string(markdown)
  var markdown_2_return = '\n\n';
  if (my_title != null) {
    if (typeof (my_title) == 'string') {
      markdown_2_return += '\n\n# ' + my_title + '\n\n';
    } else if (typeof (my_title) == 'object') {
      if (my_title.length) {
        markdown_2_return += '\n\n# [' + my_title[0] + '](' + my_title[1] + ')\n\n';
      }
    }
  }
  if (typeof (my_image) == 'string') {
    markdown_2_return += '\n\n![](' + my_image + ')\n\n';
  } else if (typeof (my_image) == 'object') {
    if (my_image.length) {
      if (my_image.length == 2) {
        markdown_2_return += '\n\n[![](' + my_image[0] + ')](' + my_image[1] + ')\n\n';
      } else if (my_image.length == 3) {
        markdown_2_return += '\n\n[![' + my_image[1] + '](' + my_image[0] + ')](' + my_image[2] + ')\n\n';
      }
    }
  }
  if (typeof (my_author) == 'string') {
    markdown_2_return += '\n\nby ' + my_author + '\n\n';
  } else if (typeof (my_author) == 'object') {
    if (my_author.length) {
      markdown_2_return += '\n\nby [' + my_author[0] + '](' + my_author[1] + ')\n\n';
    }
  }
  if (typeof (my_license) == 'string') {
    my_license = get_licence_from_url(my_license);
  }
  if (typeof (my_license) == 'string') {
    markdown_2_return += '\n\n' + my_license + '\n\n';
  } else if (typeof (my_license) == 'object') {
    if (my_license == null) {
      markdown_2_return += '\n\n<sup>probably all rights reserved, please check the website</sup>\n\n';
    } else if (my_license.length >= 3) {
      markdown_2_return += '\n\n[ ![' + my_license[0] + '](' + my_license[1] + ') ](' + my_license[2] + ')\n\n';
    } else if (my_license.length >= 2) {
      markdown_2_return += '\n\n[' + my_license[0] + '](' + my_license[2] + ')\n\n';
    } else if (my_license.length >= 1) {
      markdown_2_return += '\n\n' + my_license[0] + '\n\n';
    }
  }
  if (typeof (my_description) == 'string') {
    markdown_2_return += '\n\n' + my_description + '\n\n';
  }  //taglist

  if (typeof (my_taglist) == 'string') {
    markdown_2_return += '\n\n#' + my_taglist + '\n\n';
  } else if (typeof (my_taglist) == 'object') {
    if (my_taglist.length) {
      markdown_2_return += '\n\n#' + my_taglist.join(' #') + '\n\n';
    }
  }
  return (markdown_2_return);
}
function get_licence_from_url(s) {
  //version 1.0
  var returnobject = s;
  if (s.search(/https?\:\/\/creativecommons\.org\/licenses\/publicdomain.*/) >= 0) {
    returnobject = new Array('Public Domain', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/PD_no_rights_reserved_new.svg/100px-PD_no_rights_reserved_new.svg.png', s);
  } else if (s.search(/https?\:\/\/en\.wikipedia\.org\/wiki\/en\:public_domain.*/) >= 0) {
    returnobject = new Array('Public Domain', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/PD_no_rights_reserved_new.svg/100px-PD_no_rights_reserved_new.svg.png', s);
  } else if (s.search(/https?\:\/\/creativecommons.org\/licenses\/by\/2\.0.*/) >= 0) {
    returnobject = new Array('CC-BY 2.0', 'https://i.creativecommons.org/l/by/4.0/88x31.png', s);
  } else if (s.search(/http\:\/\/creativecommons\.org\/licenses\/by\-sa\/3\.0.*/) >= 0) {
    returnobject = new Array('CC-BY-SA 3.0', 'https://i.creativecommons.org/l/by-sa/4.0/88x31.png', s);
  } else if (s.search(/http\:\/\/www\.gnu\.org\/copyleft\/fdl\.html/) >= 0) {
    returnobject = new Array('GNU Free Documentation License', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/GFDL_Logo.svg/100px-GFDL_Logo.svg.png', s);
  } else if (s.search(/http\:\/\/creativecommons\.org\/licenses\/by\/2\.5.*/) >= 0) {
    returnobject = new Array('CC-BY 2.5', 'https://i.creativecommons.org/l/by/4.0/88x31.png', s);
  } else if (s.search(/http\:\/\/creativecommons\.org\/licenses\/by\-sa\/2\.0.*/) >= 0) {
    returnobject = new Array('CC-BY-SA 2.0', 'https://i.creativecommons.org/l/by-sa/4.0/88x31.png', s);
  } else if (s.search(/http\:\/\/creativecommons\.org\/licenses\/by\-nc\-nd\/3\.0.*/) >= 0) {
    returnobject = new Array('CC-BY-NC-ND 3.0', 'https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png', s);
  } else if (s.search(/http\:\/\/creativecommons\.org\/licenses\/by\-nc\-sa\/3\.0.*/) >= 0) {
    returnobject = new Array('CC-BY-NC-SA 3.0', 'https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png', s);
  } else if (s.search(/http\:\/\/creativecommons\.org\/licenses\/by\-nc\/3\.0.*/) >= 0) {
    returnobject = new Array('CC-BY-NC 3.0', 'https://i.creativecommons.org/l/by-nc/4.0/88x31.png', s);
  }
  
  
  http://creativecommons.org/licenses/by-nc-nd/3.0/
  
  
  return (returnobject);
}

if (window.location.hostname.search(/pixabay/) >= 0) {
  pixabay_add_sharebutton();
} else if (window.location.hostname.search(/commons\.wikimedia\.org/) >= 0) {
  wikimedia_add_sharebutton();
} else if (window.location.hostname.search(/deviantart\.com/) >= 0) {
  deviantart_add_sharebutton();
}
