pageName=location.pathname.split('/').pop().split('.')[0]||'index';
siteTpl={};
$.when(
  resload('css/style.css'),
  resload('js/siteapi.js'),
  resload('js/sitecontroller.js'),
  resload('js/pages/'+pageName+'.js'),
  resload('templates/header.html', siteTpl, 'header'),
  resload('templates/'+pageName+'.html', siteTpl, pageName),
  resload('templates/footer.html', siteTpl, 'footer')
).then(function(){
      siteApi = new SiteApi();
      siteCtl = new SiteController(siteApi,siteTpl);
      siteCtl.renderPage(pageName);
});
