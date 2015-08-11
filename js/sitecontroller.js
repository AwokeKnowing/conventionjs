var SiteController = (function () {
  function SiteController(api,templateContainer) {
    this.siteApi=api;
    this.tplContainer=templateContainer;
  }

  SiteController.prototype.renderPage = function (pageName){ 
    var _this=this;
    this.renderHeader(pageName);
    $('body').append(this.tplContainer[pageName]);
    this.renderFooter(pageName);
    this.addSiteEvents();
    this.siteApi.getSession().then(function(){
    $(document).trigger(pageName+'PageReady');
  };

  SiteController.prototype.renderHeader = function (pageName){ 
    $('body').append(this.tplContainer.header);
  };

    SiteController.prototype.renderFooter = function (pageName){ 
        $('body').append(this.tplContainer.footer);
    };

  SiteController.prototype.addSiteEvents = function (){
    var _this=this;
    $(document).on('apiSessionUpdated',function(e){});
    //add any events here that will happen o$(document).on('apiSessionUpdated',function(e){_this.updateHeaderItems()});$(document).on('apiSessionUpdated',function(e){_this.updateHeaderItems()});n all pages, such as menu clicks
  };

  return SiteController;
})();
