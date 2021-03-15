//切换页面
var toggle = {
    button: function () {
        $('footer div').each(function (idx, e) {
            $(this).on('click', function () {
                $(this).addClass('selected').siblings().removeClass('selected');
                $('section').eq(idx).addClass('active')
                $('section').eq(idx).siblings().removeClass('active')
            })
        });
    }
}

//判断页面是否滚到底部
var tool = {
    isBottom: function (view, content) {
        console.log(view.height())
        return view.height() + view.scrollTop() + 40 > content.height()
    }
}

//projectTop页面
var project = {
    page: 1,
    data: {},
    $cont: $('.pro-content'),
    $view: $('.projectTop'),
    isloading: false,

    init: function () {
        toggle.button()
        this.getData(function (res) {
            project.loadData(res)
        });
        project.scrollData()
    },

    //滚动事件
    scrollData: function () {
        $('.projectTop').on('scroll', function () {
            if (tool.isBottom(project.$view, project.$cont) && !project.isloading) {
                project.getData(function (res) {
                    project.loadData(res);
                })
                $('.loading').eq(0).show();
                $('.pro-content').addClass('cover')
            }
        })
    },

    //获取数据
    getData: function (callback) {
        project.isloading = true
        $.ajax({
            url: 'https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc',
            method: 'GET',
            data: {
                page: project.page
            },
            dataType: 'json'
        }).done(function (res) {
            callback(res)
            $('.loading').eq(0).hide(400);
            $('.pro-content').removeClass('cover')
            project.isloading = false;
            project.page++;
        }).fail(function () {
            $('.pro-content').append('<h1>404</h1>');
            $('.pro-content').append('<p>服务器异常</p>');
        })
    },

    //将获得的数据遍历加载到节点上并添加至页面
    loadData: function (datajson) {
        datajson.items.forEach(function (item, idx) {
            var $node = project.creatNode(item, (project.page - 1) * 30 + idx + 1)
            $('.pro-content').append($node)
        });
    },

    //创造节点
    creatNode: function (data, idx) {
        var $template = $(` <div class="card">
            <a href="https://github.com/freeCodeCamp/freeCodeCamp">
            <span class="number">1</span>
            <div class="cardInfo">
                <h2>freeCodeCamp</h2>
                <p>freeCodeCamp.org's open source codebase and curriculum. Learn to code for free.</p>
                <span>342342</span>&nbsp;<span>star</span>
            </div>
            </a>
        </div> `)
        $template.find('.number').text(idx)
        $template.find('a').attr('href', data.html_url)
        $template.find('.cardInfo h2').text(data.name)
        $template.find('.cardInfo p').text(data.description)
        $template.find('.cardInfo span').eq(0).text(data.stargazers_count)
        return $template;
    }
}

var userTop = {
    page: 1,
    data: {},
    $cont: $('.user-content'),
    $view: $('.userTop'),
    isloading: false,

    init: function () {
        toggle.button()
        this.getData(function (res) {
            userTop.loadData(res)
        });
        userTop.scrollData()
        console.log('user:' + userTop.page)
    },

    //滚动事件
    scrollData: function () {
        $('.userTop').on('scroll', function () {
            console.log('gun le')
            // console.log($(''))
            // console.log('gun le')
            if (tool.isBottom(userTop.$view, userTop.$cont) && !userTop.isloading) {
                userTop.getData(function (res) {
                    userTop.loadData(res);
                })
                $('.loading').eq(1).show();
                $('.user-content').addClass('cover')
            }
        })
    },

    //获取数据
    getData: function (callback) {
        userTop.isloading = true
        $.ajax({
            url: 'https://api.github.com/search/users?q=followers:>1000+location:china+language:javascript',
            method: 'GET',
            data: {
                page: userTop.page
            },
            dataType: 'json'
        }).done(function (res) {
            callback(res)
            $('.loading').eq(1).hide(400);
            $('.user-content').removeClass('cover')
            userTop.isloading = false;
            userTop.page++;
            console.log(res)
        }).fail(function () {
            $('html').append('<h1>404</h1>');
            $('html').append('<p>服务器异常</p>');
        })
    },

    //将获得的数据遍历加载到节点上并添加至页面
    loadData: function (datajson) {
        datajson.items.forEach(function (item, idx) {
            var $node = userTop.creatNode(item, (userTop.page - 1) * 30 + idx + 1)
            $('.user-content').append($node)
        });
    },

    //创造节点
    creatNode: function (data, idx) {
        var $template = $(` <div class="card">
                <a href="https://github.com/freeCodeCamp/freeCodeCamp">
                <span class="number">1</span>
                    <img src="">
                    <h2>freeCodeCamp</h2>
                </a>
            </div> `)
        $template.find(' .number').text(idx)
        $template.find('a').attr('href', data.html_url)
        $template.find('h2').text(data.login)
        $template.find('img').attr('src', data.avatar_url)
        return $template;
    }
}

var search = {
    page: 1,
    data: {},
    $cont: $('.search-content'),
    $view: $('.search'),
    isloading: false,


    init: function () {
        toggle.button()
        search.bind()
        search.scrollData()
    },


    bind: function () {
        $('.searchview .button').on('click', function () {
            $('.load').addClass('loading icon-LoadingIndicator')
            $('.search-content .card').remove();

            search.getData(function (res) {
                search.page = 1
                search.loadData(res)
                $('.load').removeClass('loading icon-LoadingIndicator')
            })
        })
        $('.searchview input').on('keyup', function (e) {
            if (e.key == 'Enter') {
                $('.search-content .card').remove();
                $('.load').addClass('loading icon-LoadingIndicator')
                search.getData(function (res) {
                    search.page = 1
                    search.loadData(res)
                    $('.load').removeClass('loading icon-LoadingIndicator')
                })
            }
        })
    },


    //滚动事件
    scrollData: function () {
        $('.search').on('scroll', function () {
            if (tool.isBottom(search.$view, search.$cont) && !search.isloading) {
                $('.load').addClass('loading icon-LoadingIndicator')
                $('.search-content').addClass('cover')
                search.getData(function (res) {
                    search.loadData(res);
                    $('.load').removeClass('loading icon-LoadingIndicator')
                })
            }
        })
    },

    //获取数据
    getData: function (callback) {
        search.isloading = true;
        var keyword = $('.searchview input').val()
        $.ajax({
            url: `https://api.github.com/search/repositories?q=${keyword}+language:javascript&sort=stars&order=desc&page=${search.page}`,
            method: 'GET',
            data: {
                page: search.page
            },
            dataType: 'json'
        }).done(function (res) {
            callback(res)
            // 
            $('.search-content').removeClass('cover')
            search.isloading = false;
            search.page++;
        }).fail(function () {
            // $('.search-content').append('<h1>404</h1>');
            // $('.search-content').append('<p>服务器异常</p>');
        })
    },

    //将获得的数据遍历加载到节点上并添加至页面
    loadData: function (datajson) {
        datajson.items.forEach(function (item, idx) {
            var $node = search.creatNode(item, (search.page - 1) * 30 + idx + 1)
            $('.search-content').append($node)
        });
    },

    //创造节点
    creatNode: function (data, idx) {
        var $template = $(` <div class="card">
            <a href="https://github.com/freeCodeCamp/freeCodeCamp">
            <span class="number">1</span>
            <div class="cardInfo">
                <h2>freeCodeCamp</h2>
                <p>freeCodeCamp.org's open source codebase and curriculum. Learn to code for free.</p>
                <span>342342</span>&nbsp;<span>star</span>
            </div>
            </a>
        </div> `)
        $template.find('.number').text(idx)
        $template.find('a').attr('href', data.html_url)
        $template.find('.cardInfo h2').text(data.name)
        $template.find('.cardInfo p').text(data.description)
        $template.find('.cardInfo span').eq(0).text(data.stargazers_count)
        return $template;
    }
}
project.init();
userTop.init();
search.init();