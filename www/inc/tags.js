var tag_editors={};

function tags(d) {
  var data;

  if(typeof d=="object") {
    data=d;
  }
  else {
    data={};
  }

  this.get=function(k) {
    return data[k];
  }

  this.get_lang=function(k) {
    var ret;
    
    if(ret=data[k+":"+lang])
      return ret;

    return data[k];
  }

  this.get_available_languages=function(k) {
    var ret=[];

    for(var i in data) {
      if((m=i.match(/^(.*):(.*)$/, k))&&(m[1]==k))
	ret.push(m[2]);
    }

    return ret;
  }

  this.set=function(k, v) {
    data[k]=v;
  }

  this.erase=function(k) {
    delete(data[k]);
  }

  this.data=function() {
    return data;
  }

  this.xml=function(indent) {
    var ret="";
    if(!indent)
      indent="";

    for(var key in data) {
      ret+=indent+"<tag k=\""+key+"\" v=\""+data[key]+"\" />\n";
    }

    return ret;
  }

  this.editor=function(div) {
    var ret="";
    var i=0;
    var editor_id=uniqid("editor_");
    tag_editors[editor_id]=this;

    ret+="<table id='"+editor_id+"'>\n";
    for(var key in data) {
      ret+="  <tr>\n";
      ret+="    <td><input name='key' value=\""+key+"\" onChange='editor_update(\""+editor_id+"\")'></td>\n";
      ret+="    <td><input name='val' value=\""+data[key]+"\" onChange='editor_update(\""+editor_id+"\")'></td>\n";
      ret+="    <td><a href='javascript:editor_remove_row(\""+editor_id+"\", "+i+")'>X</a></td>\n";
      ret+="  </tr>\n";
      i++;
    }
    ret+="</table>";
    ret+="<a href='javascript:editor_add_tag(\""+editor_id+"\")'>Add Tag</a>\n";

    if(div)
      div.innerHTML=ret;

    return ret;
  }

  this.editor_add_tag=function(editor_id) {
    var table=document.getElementById(editor_id);
    var l=table.rows.length;
    var tr=table.insertRow(l);
    var ret="";

    ret+="    <td><input name='key' onChange='editor_update(\""+editor_id+"\")'></td>\n";
    ret+="    <td><input name='val' onChange='editor_update(\""+editor_id+"\")'></td>\n";
    ret+="    <td><a href='javascript:editor_remove_row(\""+editor_id+"\", "+l+")'>X</a></td>\n";

    tr.innerHTML=ret;
  }

  this.editor_update=function(editor_id) {
    var table=document.getElementById(editor_id);
    var d={};
    
    for(var i=0; i<table.rows.length; i++) {
      var tr=table.rows[i];
      var k=tr.cells[0].firstChild.value;
      var v=tr.cells[1].firstChild.value;
      d[k]=v;
    }

    data=d;
  }

  this.editor_remove_row=function(editor_id, row) {
    var table=document.getElementById(editor_id);

    table.deleteRow(row);
    for(var i=0; i<table.rows.length; i++) {
      var tr=table.rows[i];

      tr.cells[2].innerHTML="<a href='javascript:editor_remove_row(\""+editor_id+"\", "+i+")'>X</a>";
    }

    this.editor_update(editor_id);
    alert(print_r(data));
  }

  this.readDOM=function(dom) {
    var cur=dom.firstChild;

    while(cur) {
      if(cur.nodeName=="tag") {
	this.set(cur.getAttribute("k"), cur.getAttribute("v"));
      }
      cur=cur.nextSibling;
    }
  }
}

function editor_add_tag(editor_id) {
  return tag_editors[editor_id].editor_add_tag(editor_id);
}

function editor_update(editor_id) {
  return tag_editors[editor_id].editor_update(editor_id);
}

function editor_remove_row(editor_id, row) {
  return tag_editors[editor_id].editor_remove_row(editor_id, row);
}
