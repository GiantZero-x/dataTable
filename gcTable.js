/**
 * Created by Gcx on 2017/6/26.
 */
(function ($) {
  $(function () {
    var tableList = [];

    /**
     *
     * @param $el {Element} 需要获取table自定属性的jQuery对象
     * @returns now         {Number}    创建时间戳
     * @returns url         {String}    api
     * @returns labelArr    {Array}     表头字段
     * @returns colWidthArr {Array}     列宽
     * @returns fieldArr    {Array}     数据字段
     * @returns fieldId     {String}    数据主键字段
     * @returns fieldLength {Number}    字段长度
     * @returns $queryForm  {Element}   查询form
     * @returns gcData      {String}    数据容器选择器
     * @returns gcPage      {String}    分页容器选择器
     * @returns operateArr  {Array[]}   行操作数组[[类型,操作名,按钮type,显示条件,api],...] 1: 页面层, 2: iframe层, 3: 询问框
     * @returns operateFilterArr  {Array}     行操作过滤器数组
     */
    function getDataSet($el) {
      var obj = {},
        index = $.inArray($el[0], tableList);
      if (index !== -1) {
        // 存储格式 [el0,obj0,el1,obj1,...]
        obj = tableList[index + 1];
      } else {
        obj['now'] = +new Date();  //  创建时间戳
        obj['url'] = $el.data('url');  //  api
        obj['labelArr'] = $el.data('label').split(',');  //  表头字段
        obj['colWidthArr'] = $el.data('colwidth').split(',');  // 列宽
        obj['fieldArr'] = $el.data('field').split(',');  //  数据字段
        obj['fieldId'] = $el.data('id') || 'id'; // 数据主键字段
        obj['fieldLength'] = obj['fieldArr'].length;  // 字段长度
        obj['$queryForm'] = $($el.data('query')); // 查询form
        obj['gcData'] = '.gcData' + obj['now']; // 数据容器选择器
        obj['gcPage'] = '.gcPage' + obj['now']; // 分页容器选择器
        if ($el.data('operate')) {
          obj['operateArr'] = $el.data('operate').split(','); // 行操作
          obj['operateFilterArr'] = $el.data('operatefilter').split(','); // 行操作过滤器
          $.each(obj['operateArr'], function (i, v) {
            var arr = v.split('|');
            obj['operateArr'][i] = {};
            obj['operateArr'][i]['type'] = arr[0];
            obj['operateArr'][i]['name'] = arr[1];
            obj['operateArr'][i]['class'] = arr[2];
            obj['operateArr'][i]['api'] = arr[3];
            obj['operateArr'][i]['filter'] = obj['operateFilterArr'][i];
          });
          obj['labelArr'].push('操作');
          obj['fieldArr'].push('operate');
          obj['colWidthArr'].push(obj['operateArr'].length * 30 + 70);
          obj['fieldLength']++;
        } else {
          obj['operateArr'] = null;
        }
        tableList.push($el[0], obj);
      }
      return obj;
    }

    /**
     *
     * @param $el   {Element} 表格jQuery对象
     * @param page  {Number}  请求页码
     */
    function getData($el, page) {
      var $data = getDataSet($el);
      $.getJSON($data.url + '?page=' + (page || '1') + '&pageSize=' + ($el.find('[class^=gcPage] select').val() || 10),
        $data.$queryForm.serialize()
      ).done(function (res) {
        var pageHtml = res.page || '暂无分页数据',
          dataHtml = '';
        // 判断是否有数据
        if (res.data.length === 0) {
          dataHtml = '<tr><td colspan="' + $data.fieldLength + '">暂无数据</td></tr>'
        } else {
          $.each(res.data, function (i, v) {
            dataHtml += '<tr data-id="' + v[$data.fieldId] + '">';
            $.each($data.fieldArr, function (j, field) {
              if (field === 'operate') {
                dataHtml += '<td> <div class="btn-group btn-group-xs">' +
                  (function () {
                    var btnHtml = '';
                    $.each($data.operateArr, function (k, btn) {
                      btnHtml += '<button type="button" data-id="' + v[$data.fieldId] + '" data-type="' + btn.type + '" data-api="' + btn.api + '" class="btn btn-' + (btn.class || 'default') + '">' + btn.name + '</button>'
                    });
                    return btnHtml;
                  })() +
                  '</div></td>'
              } else {
                dataHtml += '<td>' + v[field] + '</td>'
              }

            });
            dataHtml += '</tr>';
          });
          $($data.gcData).html(dataHtml);
          $($data.gcPage).html(pageHtml);
        }
      })
        .fail(function (err) {
          console.log(err)
        })
    }

    // 遍历gctable
    $('[data-gctable]')
    //  遍渲染表格框架
      .each(function (i, v) {
        var $data = getDataSet($(v)),
          stageHtml = '';
        // 渲染舞台
        stageHtml += '<div> ' +
          '<table> ' +
          '<colgroup> ' +
          (function () {
            var output = '';
            $.each($data.colWidthArr, function (i, v) {
              output += '<col width="' + Number(v) + '"> ';
            });
            return output;
          })() +
          '</colgroup> ' +
          '<thead> ' +
          '<tr> ' +
          (function () {
            var output = '';
            $.each($data.labelArr, function (i, v) {
              output += '<th>' + v + '</th> ';
            });
            return output;
          })() +
          '</tr> ' +
          '</thead> ' +
          '</table> ' +
          '</div>' +
          '<div class="gcBody"> ' +
          '<table> ' +
          '<colgroup> ' +
          (function () {
            var output = '';
            $.each($data.colWidthArr, function (i, v) {
              output += '<col width="' + Number(v) + '"> ';
            });
            return output;
          })() +
          '</colgroup> ' +
          '<tbody class="gcData' + $data.now + '"> ' +
          '</tbody> ' +
          '</table> ' +
          '</div>' +
          '<p class="gcPage' + $data.now + '"></p>';
        $(v).html(stageHtml);

        // 查询事件
        $data.$queryForm.submit(function (e) {
          e.preventDefault();
          getData($(v));
          return false;
        }).on('reset', function () {
          setTimeout(function () {
            getData($(v));
          }, 0)
        }).submit();
      })
      //  点击跳页
      .on('click', '[data-page]', function () {
        getData($(this).closest('[data-gctable]'), $(this).data('page'))
      })
      //  输入跳页
      .on('keyup', '.page_input', function (e) {
        if (e.keyCode === 13) {
          var $this = $(this),
            $parent = $this.closest('[data-gctable]'),
            page = parseInt($this.val()) || 1,
            max = $this.data('pagenum');
          if (page < 1) {
            $this.val(1);
            getData($parent);
          } else if (page > max) {
            $(this).val(max);
            getData($parent, max);
          } else {
            getData($parent, page);
          }
        }
      })
      // 切换显示条数重新获取数据
      .on('change', '[class^=gcPage] select', function (e) {
        e.stopPropagation();
        getData($(this).closest('[data-gctable]'))
      })
      .on('click', '[data-type]', function (e) {
        e.stopPropagation();
        var $data = $(this).data();
        console.log($data);
        window[$data.api] && window[$data.api]($data.id)
      })
  })
})(window.jQuery);

function update(id) {
  console.log('修改', id)
}