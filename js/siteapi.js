var SiteApi = (function () {
  function SiteApi(initially) 
    {
        this._defaultsession={
            isLoggedIn:'',
        };
        this.session=$.extend({},this._defaultsession);
        this.json={}; 
    }

    SiteApi.prototype.getSession=function(){
        _this=this;
        var prom = $.Deferred();
        setTimeout(function(){//simulate getting data from somewhere (eg a $.post)
        _this.session.isLoggedIn=true;
        $(document).trigger('apiSessionUpdated');
          prom.resolve();
      },1000);

        return prom;
    };

    return SiteApi;
})();
