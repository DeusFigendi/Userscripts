// ==UserScript==
// @name        Diaspora nested comments
// @namespace   deusfigendi
// @description Generates and shows nested comments in Diaspora
// @downloadURL https://github.com/DeusFigendi/Userscripts/raw/master/Diaspora/Nested_Comments.user.js
// @include     https://pod.geraspora.de/*
// @include     http*://joindiaspora.com/*
// @include     http*://diasp.org/*
// @include     http*://despora.de/*
// @include     http*://ilikefreedom.org/*
// @include     http*://nerdpol.ch/*
// @include     http*://diasp.eu/*
// @include     http*://kosmospora.net/*
// @include     http*://pod.orkz.net/*
// @include     http*://wk3.org/*
// @include     http*://diasp0ra.ca/*
// @include     http*://diasp.de/*
// @include     http*://stylr.net/*
// @include     http*://mipod.us/*
// @include     http*://friendica.eu/*
// @include     http*://pod.sd.vc/*
// @include     http*://sechat.org/*
// @include     http*://socializer.cc/*
// @include     http*://frndk.de/*
// @include     http*://whompify.com/*
// @include     http*://calispora.org/*
// @include     http*://pod.lausen.nl/*
// @include     http*://adris.es/*
// @include     http*://diapod.net/*
// @include     http*://www.optimistisch.de/*
// @include     http*://diaspora.linuxmaniac.net/*
// @include     http*://spyurk.am/*
// @include     http*://fabdofriends.de/*
// @include     http*://sxspora.de/*
// @include     http*://social.mrzyx.de/*
// @include     http*://pingupod.de/*
// @include     http*://jenaspora.de/*
// @include     http*://diaspora.scarleo.se/*
// @include     http*://pirati.ca/*
// @include     http*://friends.dostmusik.de/*
// @include     http*://social.mathaba.net/*
// @include     http*://nerdpol.ch/*
// @include     http*://framasphere.org/*
// @include     http*://diaspora-fr.org/*
// @version     1.1
// @grant       none
// ==/UserScript==

function local2global(local_id) {
    //this function catches the global ID for a given local ID SYCHRONIOUS
    //so the website will not react until the request is answered.
    
    var requestobject = new XMLHttpRequest();  
    
    requestobject.open("GET",'/posts/'+local_id+".json",false);
    requestobject.send();
    
    var post_content = JSON.parse(requestobject.responseText);
    
    return(post_content.guid);
}

function shorten_name(old_name) {
    return old_name;
}

function reply_to_this(rply_btn) {
    //okay, find the comments ID and the posts ID…
    var comment_element = rply_btn;
    while (comment_element.classList.contains("bd") == false) {
       comment_element = comment_element.parentNode;
    }
    comment_element = comment_element.parentNode;
    var comment_id = comment_element.id;
    var comment_area = comment_element.parentNode;
    
    while (comment_area.classList.contains("comment_stream") == false) {
       comment_area = comment_area.parentNode;
    }
    
    var post_element = comment_area;
    comment_area = comment_area.getElementsByClassName("comment_box")[0];
    
    if ((document.getElementById("main_stream"))) {
       while (post_element.classList.contains("stream_element") == false) {
           post_element = post_element.parentNode;
        }
    
        var post_timestamp = post_element.getElementsByClassName("timeago")[0];
        var singlepost_link = post_timestamp.parentNode;
    
        var post_id = singlepost_link.href.match(/\/[0-9a-f]+$/)[0].match(/[0-9a-f]+/)[0];
    } else if ((document.getElementById("single-post-interactions"))) {
        var post_id = window.location.pathname.match(/\/[0-9a-f]+$/)[0].match(/[0-9a-f]+/)[0];
    } else {
        var post_id = "cannotfindpostid";
    }
    
    if (/\D/.test(post_id)) {
       //this is a global unique ID of the post I'd say.
    } else {
       //this seems to be the local ID, should get the global one.
        post_id = local2global(post_id);
    }
            
    // okay, we know the global ID and the comments ID it would be usefull to know what's selected and the nickname of the author.
    
    var selectedText =nestedcommentsglobalvariable_selectedtext;
    
    var authorsName = comment_element.getElementsByClassName("author")[0].firstChild.data.replace(/(^\s*|\s*$)/g,"");
    
    //fine, we can generate the URL, we have the authors name and the content of the selection.
    //Let's decide how the link will look like.
    
    if ((selectedText.length > 1) && (selectedText.length < 30)) {
        var linktext = selectedText;
        var linktitle = "";
    } else if ((selectedText.length >= 30) && (selectedText.length < 100)) {
        var linktext = "@"+authorsName;
        var linktitle = " \""+selectedText+"\"";
    } else if ((selectedText.length >= 100)) {
        var linktext = "@"+authorsName;
        var linktitle = " \""+selectedText.slice(0,50)+"…\"";
    } else if ((authorsName.length >= 20)) {
        var linktext = "@"+shorten_name(authorsName);
        var linktitle = "";
    } else {
        var linktext = "@"+authorsName;
        var linktitle = "";        
    }
    
    //comment_area.value = "<sup>[@"+authorsName+"](/posts/"+post_id+"#"+comment_id+" \""+selectedText+"\")</sup>\n\n";
    if (linktext.length > 20) {
        comment_area.value = "<sub><sup>["+linktext+"](/posts/"+post_id+"#"+comment_id+linktitle+")</sup></sub>\n\n";
    } else {       
        comment_area.value = "<sup>["+linktext+"](/posts/"+post_id+"#"+comment_id+linktitle+")</sup>\n\n";
    }
    
    comment_area.focus();
}

//Was es als erstes braucht ist ein "reply to"-Button…

function add_reply_btn(element) {
    if (!element.classList.contains("nestedcomments_proceded")) {
       // element = div-element of the class "comments media" and data-template "comment"
       //generate reply-btn:
    
       var a = document.createElement("a");
       a.className = "comment_reply";
       a.setAttribute("title","Reply to this comment");
       a.setAttribute("data-type","comment");
    
       a.addEventListener("click",function(){ reply_to_this(this); },false);
       a.addEventListener("mouseover",function(){ nestedcommentsglobalvariable_selectedtext = window.getSelection().getRangeAt(0).toString().replace(/\s+/g," "); },false);
        
        
    
       var div = document.createElement("div");
       div.className = "icons-replycomment";
        
       a.appendChild(div);
    
       element.getElementsByClassName("controls")[0].appendChild(a);
       //element.style.backgroundColor = "#999";
    }
}

function move_comment(element) {
    if (!element.classList.contains("nestedcomments_proceded")) {
       element.classList.add("nestedcomments_proceded");
       var comment_content = element.getElementsByClassName("comment-content")[0];
       var link_list = comment_content.getElementsByTagName("a");
       if (link_list.length > 0) {
           var first_link = link_list[0].href;        
           if (/\/posts\/[0-9a-f]+\#([0-9a-f]+)$/.test(first_link)) {
                var parent_comments_id = RegExp.$1;
                var parent_comment = document.getElementById(parent_comments_id);
                if(parent_comment) {
                    parent_comment.appendChild(element);
                }
           }
        }
    }
    //element.style.backgroundColor = "#f55";
}

function stuff_to_do_after_a_short_while() {
    
    if ((document.getElementById("main_stream")) || (document.getElementById("single-post-interactions"))) {
        
       //seems to be a streamlike site.
    
       var mystyle = document.createElement("style");
       var mystyle_content = ".comment.media .controls .comment_reply {\n    transition: opacity 0.1s linear 0s;\n    opacity: 0;\n}\n\n";
       mystyle_content += ".controls .comment_reply {\n    display: inline-block;\n}\n\n";
       mystyle_content += ".controls .comment_reply .icons-replycomment {\n    height: 14px;\n    width: 17px;\n}\n\n\n";
       mystyle_content += ".icons-replycomment {\n    background: url('https://pod.geraspora.de/assets/icons-s2a552afa2f-775c31119917cd66c202c05de7d3e728.png') no-repeat scroll 0% 0% transparent;\n}\n\n\n";
       mystyle_content += ".icons-replycomment {\n    background-position: 0px -2843px;\n}\n\n\n\n\n";
       mystyle_content += ".icons-replycomment {\n    cursor:pointer;\n}\n\n\n\n\n";
       mystyle_content += ".comment.media:hover .controls .comment_reply{\n          filter:alpha(opacity=30);\n  -moz-opacity:0.3;\n -khtml-opacity:0.3;\n opacity:0.3\n}\n\n";
       mystyle_content += ".comment.media:hover .controls .comment_reply:hover{\n    filter:alpha(opacity=100);\n -moz-opacity:1;\n   -khtml-opacity:1;\n   opacity:1\n}\n\n";
       mystyle_content += ".comment.media > div > .comment.media{\n    margin-left:50px;\n      border-left:1px solid #CCC;\n}\n\n";
            
       mystyle.appendChild(document.createTextNode(mystyle_content));
       document.getElementsByTagName("head")[0].appendChild(mystyle);
    
       
       if ((document.getElementById("main_stream"))) {
           /*
          var list_of_comments = document.getElementsByClassName("comments");
          var list_of_comments2 = null;
          var list_of_comments3 = null;
          for (var i=0; i < list_of_comments.length; i++) {
              list_of_comments2 = list_of_comments[i].getElementsByClassName("comments");
              if (list_of_comments2.length > 0) {
                  list_of_comments3 = list_of_comments2[0].getElementsByClassName("comment");
                  if (list_of_comments3.length > 0) {
                    for (var j=0; j < list_of_comments3.length; j++) {
                        if (list_of_comments3[j].classList.contains("media")) {
                           add_reply_btn(list_of_comments3[j]);
                        }
                    }
                    for (var j=0; j < list_of_comments3.length; j++) {
                        if (list_of_comments3[j].classList.contains("media")) {
                           move_comment(list_of_comments3[j]);
                        }
                    }
                 }
             }
          }
           */
       } else if ((document.getElementById("single-post-interactions"))) {
           /*
          var list_of_comments = document.getElementsByClassName("comments");
          var list_of_comments2 = list_of_comments;
          var list_of_comments3 = null;        
              if (list_of_comments2.length > 0) {
                  list_of_comments3 = list_of_comments2[0].getElementsByClassName("comment");
                  if (list_of_comments3.length > 0) {
                     for (var j=0; j < list_of_comments3.length; j++) {
                        if (list_of_comments3[j].classList.contains("media")) {
                           add_reply_btn(list_of_comments3[j]);
                        }
                    }
                    for (var j=0; j < list_of_comments3.length; j++) {
                        if (list_of_comments3[j].classList.contains("media")) {
                           move_comment(list_of_comments3[j]);                           
                        }
                    }
                 }
             }
       */
          
       }
    } else if (false) {
        //foo0
    }
}

function stuff_to_do_over_and_over_again() {
           
       if ((document.getElementById("main_stream"))) {
          var list_of_comments = document.getElementsByClassName("comments");
          var list_of_comments2 = null;
          var list_of_comments3 = null;
          for (var i=0; i < list_of_comments.length; i++) {
              list_of_comments2 = list_of_comments[i].getElementsByClassName("comments");
              if (list_of_comments2.length > 0) {
                  list_of_comments3 = list_of_comments2[0].getElementsByClassName("comment");
                  if (list_of_comments3.length > 0) {
                    for (var j=0; j < list_of_comments3.length; j++) {
                        if (list_of_comments3[j].classList.contains("media")) {
                           add_reply_btn(list_of_comments3[j]);
                        }
                    }
                    for (var j=0; j < list_of_comments3.length; j++) {
                        if (list_of_comments3[j].classList.contains("media")) {
                           move_comment(list_of_comments3[j]);
                        }
                    }
                 }
             }
          }
       } else if ((document.getElementById("single-post-interactions"))) {
          var list_of_comments = document.getElementsByClassName("comments");
          var list_of_comments2 = list_of_comments;
          var list_of_comments3 = null;        
              if (list_of_comments2.length > 0) {
                  list_of_comments3 = list_of_comments2[0].getElementsByClassName("comment");
                  if (list_of_comments3.length > 0) {
                     for (var j=0; j < list_of_comments3.length; j++) {
                        if (list_of_comments3[j].classList.contains("media")) {
                           add_reply_btn(list_of_comments3[j]);
                        }
                    }
                    for (var j=0; j < list_of_comments3.length; j++) {
                        if (list_of_comments3[j].classList.contains("media")) {
                           move_comment(list_of_comments3[j]);                           
                        }
                    }
                 }
             }
          
       } else {
          //do nothing
       }
}

window.setTimeout(stuff_to_do_after_a_short_while,1888);
window.setTimeout(stuff_to_do_over_and_over_again,1999);
window.setInterval(stuff_to_do_over_and_over_again,19999);
