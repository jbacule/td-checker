$(function() {
    $('#content-container > div.ng-scope > div.td-page.td-page-edit-time.contentWrapper.ng-scope > div.td-filters.td-filters-fixed.td-filters-no-user-selection > div.pull-right.td-filters-right-side').append(`<p id="customElem" class="pull-left" style="background-color: #2B405B; color: white; padding: 6px 6px; border-radius:5px; position:relative; border: 1px solid #D5DDE0; font-size:15px !important;">Calculating...</p>`);
    setTimeout(()=>{
       validateTD();
    },4000);
});

//reload validator
document.body.onkeyup = function(e){
  if(e.ctrlKey && e.keyCode == 13){ //keyboard shortcut: ctrl key + enter
        $('#customElem').text('Re-calculating...');
     setTimeout(()=>{
        $('#customElem').text('');
       validateTD();
    },2000);
  }
}

function validateTD(){
  //no project
  var countNoProject = 0;
  $('tr.ng-scope.td-row-computer-time').each(function(){
    var val = $(this).find('td.ng-binding.ng-scope').text().match('No Project');
    if(val!=null){
        countNoProject++;
    }
  });
  //not working
  var NotWorking = 0;
  $('tr.ng-scope.td-row-grayed').each(function(elem){
      NotWorking++;
   });
   //total break
  var adminBreaks = [];
  $('tr.ng-scope.td-row-computer-time').each(function(){
    var val = $(this).find('td.ng-binding').text().match('admin-break');
    if(val!=null){
        var time = $(this).find('td > span.ng-scope').text();
        var cleanedTime = cleanTime(time);
        if(cleanedTime.length<3){
           adminBreaks.push(secondsToMinutes(cleanedTime));
        }else{
           adminBreaks.push(cleanedTime);
        }
    }
  });
   var totalBreak = addTimes(adminBreaks);
   setValidator(countNoProject, NotWorking, totalBreak);
}

function setValidator(NoProject, countNotWorking, totalBreak){
   var NoProjectElem = NoProject != 0 ? `<span style="color: #F46736; font-weight: bold;">${NoProject}</span>` : `<span style="color: #51BE71; font-weight: bold;">${NoProject}</span>`;
   var countNotWorkingElem = countNotWorking > 3 ? `<span style="color: #F46736; font-weight: bold;">${countNotWorking}</span>` : `<span style="color: #51BE71; font-weight: bold;">${countNotWorking}</span>`;
   var totalBreakElem = `<span style="color: #51BE71; font-weight: bold;">${totalBreak}</span>`;
   $('#customElem').html(`No Project: ${NoProjectElem} | Not Working: ${countNotWorkingElem} | Total Break: ${totalBreakElem}`);
}

function addTimes(times = []) {
    var minute = 0;
    var second = 0;
    for (var time of times) {
        var splited = time.split(':');
        minute += parseInt(splited[0]);
        second += parseInt(splited[1]);
    }
    var seconds = second % 60;
    var minutes = parseInt(minute % 60) + parseInt(second / 60);

    return z(minutes) + ':' + z(seconds)
}

function z(n){
  return (n < 10 ? '0' : '') + n;
}

function cleanTime(time){
  var time1 = time.replace(/ not approved|s/g,'');
  var time2 = time1.replace('m ',':');

  return time2;
}

function secondsToMinutes(time){
    return Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2);
}