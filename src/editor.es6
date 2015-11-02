/* style import */
import 'animate.css/animate.css'
import 'font-awesome/css/font-awesome.css'
import 'foundation-sites/css/foundation.css'
import 'codemirror/lib/codemirror.css'
import './neoqi.css'
import 'cropper/dist/cropper.css'
import 'highlight.js/styles/tomorrow.css'
import './editor.css'

/* related import */
import 'codemirror/mode/gfm/gfm'

/* modules import */
import $ from 'jquery'
import hljs from 'highlight.js'
import marked from 'marked'
import CodeMirror from 'codemirror'

/* running import */
import 'foundation-sites'
import 'cropper'
import 'noty'

let $document = $(document);

$document.foundation();

//新建两个编辑器 - START
let editor_opt = {
    user_id: '0',
}

var current_file = '';

let cmeditorUpper = CodeMirror.fromTextArea(document.querySelector('#cmeditor-upper'), {
    lineNumbers: false,
    lineWrapping: true,
    mode: 'gfm',
    theme: 'neoqi'
});
let cmeditorLower = CodeMirror.fromTextArea(document.querySelector('#cmeditor-lower'), {
    lineNumbers: false,
    lineWrapping: true,
    mode: 'gfm',
    theme: 'neoqi'
});
//新建两个编辑器 - END
//----------------------
//初始化 Markdown 解释器 marked
marked.setOptions({
    gfm: true,
    breaks: true,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    highlight: (code) => hljs.highlightAuto(code).value
});
//---------------------
// 当页面有改动时更新页面内容
function update(editor, target){
    let val = editor.getValue();
    let des = document.querySelector(target);
    des.innerHTML = marked(val);
}
update(cmeditorUpper, '#upper-editor .markdown-result > .row');
update(cmeditorLower, '#lower-editor .markdown-result > .row');
cmeditorUpper.on('change', () => {
    update(cmeditorUpper, '#upper-editor .markdown-result > .row');
});
cmeditorLower.on('change', () => {
    update(cmeditorLower, '#lower-editor .markdown-result > .row');
});
//---------------------
// 内容与编辑器同步滚动
var upperEditorScroll = document.querySelector('#upper-editor .CodeMirror-scroll');
var lowerEditorScroll = document.querySelector('#lower-editor .CodeMirror-scroll');
var upperResultScroll = document.querySelector('#upper-editor .markdown-result');
var lowerResultScroll = document.querySelector('#lower-editor .markdown-result');
var scrolling = false;
upperEditorScroll.addEventListener('scroll', () => {
    if(!scrolling){
        scrolling = true;
        upperResultScroll.scrollTop = upperEditorScroll.scrollTop * upperResultScroll.scrollHeight / upperEditorScroll.scrollHeight;
        setTimeout(() => scrolling = false , 50);
    }
});
lowerEditorScroll.addEventListener('scroll', () => {
    if(!scrolling){
        scrolling = true;
        lowerResultScroll.scrollTop = lowerEditorScroll.scrollTop * lowerResultScroll.scrollHeight / lowerEditorScroll.scrollHeight;
        setTimeout(() => scrolling = false , 50);
    }
});
upperResultScroll.addEventListener('scroll', () => {
    if(!scrolling){
        scrolling = true;
        upperEditorScroll.scrollTop = upperResultScroll.scrollTop * upperEditorScroll.scrollHeight / upperResultScroll.scrollHeight;
        setTimeout(() => scrolling = false , 50);
    }
});
lowerResultScroll.addEventListener('scroll', () => {
    if(!scrolling){
        scrolling = true;
        lowerEditorScroll.scrollTop = lowerResultScroll.scrollTop * lowerEditorScroll.scrollHeight / lowerResultScroll.scrollHeight;
        setTimeout(() => scrolling = false , 50);
    }
});
//--------------------
// 快捷按钮定义文本格式
var focus_part = 0; //当前正在编辑的编辑器编号
var image_input = document.querySelector('#choose-image-input');
var $image = $('.image-cropper-container > img');

document.querySelector('#upper-editor').addEventListener('click', () => focus_part = 1);
document.querySelector('#lower-editor').addEventListener('click', () => focus_part = 2);
function setOperation(oper){
    switch (focus_part){
        case 1:
            oper(cmeditorUpper);
            break;
        case 2:
            oper(cmeditorLower);
            break;
        default:
            break;
    }
}
function setBold(){
    function toBold(s) {
        if(s.trim() == ''){
            return '**strong text**';
        }
        return '**' + s + '**';
    }
    function toBoldList(blist){
        for(var i = 0; i < blist.length; i++){
            blist[i] = toBold(blist[i]);
        }
        return blist;
    }
    setOperation((cm) => cm.replaceSelections(toBoldList(cm.getSelections())));
}
function setItalic(){
    function toItalic(s) {
        if(s.trim() == ''){
            return '*italic text*';
        }
        return '*' + s + '*';
    }
    function toItalicList(ilist){
        for(var i = 0; i < ilist.length; i++){
            ilist[i] = toItalic(ilist[i]);
        }
        return ilist;
    }
    setOperation((cm) => cm.replaceSelections(toItalicList(cm.getSelections())));
}
function setQuote(){
    function toQuote(s) {
        if(s.trim() == ''){
            return '\n\n> Blockquote\n\n';
        }
        var lines = s.split('\n');
        if(lines.length > 1){
            var temp = '\n';
            lines.forEach(function(line){
                temp = temp + '> ' + line + '\n';
            });
            temp = temp + '\n';
            return temp;
        }
        return '\n> ' + s + '\n\n';
    }
    function toQuoteList(qlist){
        for(var i = 0; i < qlist.length; i++){
            qlist[i] = toQuote(qlist[i]);
        }
        return qlist;
    }
    setOperation((cm) => cm.replaceSelections(toQuoteList(cm.getSelections())) );
}
function setUlList(){
    function toUlList(s) {
        if(s.trim() == ''){
            return '\n\n- List item\n\n';
        }
        var lines = s.split('\n');
        if(lines.length > 1){
            var temp = '\n';
            lines.forEach(function(line){
                temp = temp + '- ' + line + '\n';
            });
            temp = temp + '\n';
            return temp;
        }
        return '\n- ' + s + '\n\n';
    }
    function toUlListList(ulist){
        for(var i = 0; i < ulist.length; i++){
            ulist[i] = toUlList(ulist[i]);
        }
        return ulist;
    }
    setOperation((cm) => cm.replaceSelections(toUlListList(cm.getSelections())));
}
function setOlList(){
    function toOlList(s) {
        if(s.trim() == ''){
            return '\n\n1. List item\n\n';
        }
        let lines = s.split('\n');
        if(lines.length > 1){
            var temp = '\n';
            lines.forEach((line, i) => {
                temp = temp + (i+1) + '. ' + line + '\n';
            });
            temp = temp + '\n';
            return temp;
        }
        return '\n1. ' + s + '\n\n';
    }
    function toOlListList(olist){
        for(var i = 0; i < olist.length; i++){
            olist[i] = toOlList(olist[i]);
        }
        return olist;
    }
    setOperation((cm) => cm.replaceSelections(toOlListList(cm.getSelections())));
}
function setHr(){
    function toHr(s) {
        return '\n\n---------- \n\n';
    }
    function toHrList(blist){
        for(var i = 0; i < blist.length; i++){
            blist[i] = toHr(blist[i]);
        }
        return blist;
    }
    setOperation((cm) => cm.replaceSelections(toHrList(cm.getSelections())));
}
function setLink(link){
    function toLink(s) {
        if(s.trim() === '' || s.split('\n').length > 1){
            return s;
        }
        return '[' + s + '](' + link + ')';
    }
    function toLinkList(blist){
        for(var i = 0; i < blist.length; i++){
            blist[i] = toLink(blist[i]);
        }
        return blist;
    }
    setOperation((cm) => cm.replaceSelections(toLinkList(cm.getSelections())));
}
function setImage(){
    var crop_data = $image.cropper('getData');
    var cropped_canvas = null;
    if( crop_data.width < 970 ){
        cropped_canvas = $image.cropper('getCroppedCanvas');
    } else {
        var c_width = 970;
        var c_height = crop_data.height * 970 / crop_data.width;
        cropped_canvas = $image.cropper('getCroppedCanvas', { width: c_width, height: c_height });
    }
    document.querySelector('.img-loading').style.display = '';
    $.post('/img/base64Upload', { data: cropped_canvas.toDataURL() }, (retjson) => {
        if(retjson.status){
            var link = retjson.img;
            function toImage(s) {
                return '![' + s.trim() + '](' + link + ')';
            }
            function toImageList(blist){
                for(var i = 0; i < blist.length; i++){
                    blist[i] = toImage(blist[i]);
                }
                return blist;
            }
            setOperation((cm) => cm.replaceSelections(toImageList(cm.getSelections())));
            $('#image-cropper-modal').foundation('reveal', 'close');
        }
    }, 'json');
}
function setTable(){
    function toTable(s) {
        return [
            '',
            '',
            '| 列一(默认左对齐) | 列二(右对齐) | 列三(中间对齐) |',
            '| --------   | -----:  | :----:  |',
            '| 计算机     | $1600 |   5     |',
            '| 手机        |   $12   |   12   |',
            '| 管线        |    $1    |  234  |',
            '',
            ''
        ].join('\n');
    }
    function toTableList(blist){
        for(var i = 0; i < blist.length; i++){
            blist[i] = toTable(blist[i]);
        }
        return blist;
    }
    setOperation((cm) => cm.replaceSelections(toTableList(cm.getSelections())));
}
// 增加超链接的模态框
document.querySelector('#add-link-modal .button').addEventListener('click', () => {
    var inp = document.querySelector('#add-link-modal input');
    setLink(inp.value);
    $('#add-link-modal').foundation('reveal', 'close');
});
$('#add-link-modal').on('close.fndtn.reveal', () => document.querySelector('#add-link-modal input').value = '');
// ------------------
function editorAction(){
    //TODO: 编辑器右侧扩展
}
function lowerAction(direction){
    var lowerSection = document.querySelector('#lower-editor');
    var upperSection = document.querySelector('#upper-editor');
    var step = parseInt(lowerSection.getAttribute('step'));
    if(direction == 'up'){
        step = step - 1;
    }else {
        step = step + 1;
    }
    if(step == -1){ step = 3 }
    if(step == 4){ step = 0 }
    lowerSection.setAttribute('step', step);
    switch (step){
        case 0:
            lowerSection.style.top = '1%';
            break;
        case 1:
            lowerSection.style.top = '50%';
            upperSection.style.bottom = '50%';
            break;
        case 2:
            lowerSection.style.top = '80%';
            upperSection.style.bottom = '20%';
            break;
        case 3:
            lowerSection.style.top = '95%';
            upperSection.style.bottom = '5%';
            break;
    }
}
lowerAction('none');

document.querySelector('#choose-image-btn').addEventListener('click', () => {
    image_input.value = '';
    image_input.click();
});
image_input.addEventListener('change', () => $('#image-cropper-modal').foundation('reveal', 'open'));
$('#image-cropper-modal')
.on('opened.fndtn.reveal', () => {
    var URL = window.URL || window.webkitURL,
            blobURL;
    var files = image_input.files,
            file;

    if (files && files.length) {
        file = files[0];
        if (isImageFile(file)) {
            blobURL = URL.createObjectURL(file);
            $image.attr('src', blobURL);
            $image.cropper({
                strict: false,
                guides: false,
                highlight: false,
                dragCrop: false,
                movable: false,
                resizable: false
            }).one('built.cropper', () => {
                URL.revokeObjectURL(blobURL); // Revoke when load complete
                document.querySelector('#insert-image-btn').style.display = '';
            });
        } else {
            console.log('Please choose an image file.');
            $('#image-cropper-modal').foundation('reveal', 'close');
        }
    }else {
        $('#image-cropper-modal').foundation('reveal', 'close');
    }
})
.on('close.fndtn.reveal', () => {
    document.querySelector('.img-loading').style.display = 'none';
    $image.attr('src', 'img/loading.gif');
    $image.cropper('destroy');
    document.querySelector('#insert-image-btn').style.display = 'none';
});

let local_system_config = {
    prefix: 'codefrom_config',
    user_project_list: 'u_p_list',
    default_project_list: 'd_p_llist'
}
let user_project_options = {
    site: 'codefrom',
    type: 'markdown',
    folder: 'user_project'
};
let default_project_options = {
    site: 'codefrom',
    type: 'markdown',
    folder: 'default_project'
};
$('#add-file-modal #add-file-btn').on('click', () => {
    current_file = $('#add-file-modal #add-file-input').val();
    saveLocalProject(current_file, editor_opt.user_id, [cmeditorUpper.getValue(), cmeditorLower.getValue()]);
    updateFileList();
    $('#add-file-modal').foundation('reveal', 'close');
});
function newProject(md_list){
    openProject(md_list, '');
}
function openProject(md_list, filename){
    current_file = filename;
    if(typeof md_list != "object" || md_list.length == undefined || md_list.length < 2) md_list = ['',''];
    cmeditorUpper.setValue(typeof md_list[0] == 'string'?md_list[0]:'');
    cmeditorLower.setValue(typeof md_list[1] == 'string'?md_list[1]:'');
    var n = noty({
            text: '成功' + (filename == '' ? '新建临时草稿' : ('打开草稿《' + filename + '》')) + '！',
            layout: 'bottomRight',
            theme: 'relax', // or 'relax'
            type: 'success',
            animation: {
                    open: 'animated flipInX', // Animate.css class names
                    close: 'animated flipOutX', // Animate.css class names
                    easing: 'swing', // unavailable - no need
                    speed: 500 // unavailable - no need
            }
    });
    setTimeout(() => n.close(), 5000);
}
// filename = site _ [userid] _ folder _ [filename] _ type
function saveLocalProject(filename, userid, markdown_list){
    if(filename == ''){
        var whole_filename = 'codefrom_temp_project_markdown';
        localStorage[whole_filename] = JSON.stringify(markdown_list);
    } else {
        var whole_filename = [
            user_project_options.site,
            userid,
            user_project_options.folder,
            filename,
            user_project_options.type
        ].join('_');
        var u_list_path = [local_system_config.prefix, local_system_config.user_project_list].join('_');
        if(localStorage[u_list_path] == undefined) localStorage[u_list_path] = '[]';
        var u_list = JSON.parse(localStorage[u_list_path]);
        if(u_list.indexOf(filename) < 0) {
            u_list.push(filename);
            localStorage[u_list_path] = JSON.stringify(u_list);
        }
        localStorage[whole_filename] = JSON.stringify(markdown_list);
    }
    localStorage.codefrom_current_file = filename;
    var n = noty({
            text: '当前草稿《' + (filename == '' ? '临时文档' : filename) + '》 - 保存成功！',
            layout: 'bottomRight',
            theme: 'relax', // or 'relax'
            type: 'success',
            animation: {
                    open: 'animated flipInX', // Animate.css class names
                    close: 'animated flipOutX', // Animate.css class names
                    easing: 'swing', // unavailable - no need
                    speed: 500 // unavailable - no need
            }
    });
    setTimeout(() => n.close(), 5000);
}
function saveCurrentProject(){
    if(current_file == ''){
        $('#add-file-modal #add-file-input').val('');
        $('#add-file-modal').foundation('reveal', 'open');
    }else{
        saveLocalProject(current_file, editor_opt.user_id, [cmeditorUpper.getValue(), cmeditorLower.getValue()]);
    }
}
function submitProject(){
    if(localStorage.codefrom_temp_project_basic_info == undefined) {
        //TODO: 无基础信息
        return;
    }
    let basic_info = JSON.parse(localStorage.codefrom_temp_project_basic_info);
    let function_markdown = cmeditorUpper.getValue(); // 上面功能介绍
    let function_content = marked(function_markdown);
    let usage_markdown = cmeditorLower.getValue(); // 下面使用说明
    let usage_content = marked(usage_markdown);
}
function updateFileList(){
    var $file_list = $('#file-list');
    $file_list.empty();
    var u_list_path = [local_system_config.prefix, local_system_config.user_project_list].join('_');
    if(localStorage[u_list_path] == undefined) localStorage[u_list_path] = '[]';
    var u_list = JSON.parse(localStorage[u_list_path]);
    for(var i = 0; i < u_list.length; i++){
        var filename = u_list[i];
        var $item = $('<li><a href="javascript:void(0);">' + filename + '</a></li>').data('filename', filename);
        $item.on('click', function() {
            var f_name = $(this).data('filename');
            var whole_filename = [
                user_project_options.site,
                editor_opt.user_id,
                user_project_options.folder,
                f_name,
                user_project_options.type
            ].join('_');
            var m_list = JSON.parse(localStorage[whole_filename]);
            openProject(m_list, f_name);
        });
        $file_list.append($item);
    }
}
updateFileList();
setInterval(() => {
    saveLocalProject(current_file, editor_opt.user_id, [cmeditorUpper.getValue(), cmeditorLower.getValue()]);
}, 10000);
$(document).keydown((e) => {
    // ctrl + s
    if( e.ctrlKey  == true && e.keyCode == 83 ){
        saveCurrentProject();
        return false; // 截取返回false就不会保存网页了
    }
});
if(localStorage.codefrom_current_file == undefined) {
    $.get('md/1.md', (v) => cmeditorUpper.setValue(v));
    $.get('md/2.md', (v) => cmeditorLower.setValue(v));
} else {
    var whole_filename = localStorage.codefrom_current_file == '' ? 'codefrom_temp_project_markdown' : ([
        user_project_options.site,
        editor_opt.user_id,
        user_project_options.folder,
        localStorage.codefrom_current_file,
        user_project_options.type
    ].join('_'));
    var m_list = JSON.parse(localStorage[whole_filename] || '[]');
    openProject(m_list, localStorage.codefrom_current_file)
}

window.CFMDeditor = {
    submitProject,
    saveCurrentProject,
    lowerAction,
    newProject,
    setBold,
    setItalic,
    setQuote,
    setImage,
    setTable,
    setOlList,
    setUlList,
    setHr,
}

document.querySelector('#preload').style.display = 'none';