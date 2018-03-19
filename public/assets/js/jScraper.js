$(function() {
  	$("#scrape-btn").on('click', function(){
  		scrape();
  	});

  	$("#saved-btn").on('click', function(){
  		window.location.pathname = "/jobs";
  		location.reload();
  	});

	$(".job-link-btn").on('click', function(){
		let link = $(this).data('link');
		var win = window.open(link, '_blank');
		if (win) {
		    win.focus();
		} 
		else {
    		//Browser has blocked new window opening
    		window.location.pathname = link;
		}
	});

	$(".job-notes-btn").on('click', function(){
		let id = $(this).data('id');
		showJobNotes(id);
	});

	$("#add-note").on("click", function(){
		let job_id = $(this).data('job');
		// console.log("pressed Add new note button for job: "+job_id);
		addNote(job_id);
	});

	$(".remove-btn").on('click', function(){
		let id = $(this).data('id');
		$.ajax("/api/jobs/" + id, {
			type :"DELETE"
	    }).then( function(){
	        location.reload();
	    });
	});

	$("#saved-notes").on('click', '.del-note-btn', function(){
		let id = $(this).data('id');
		let jId = $(this).data('j_id');
		// console.log(`DELTE NOTE: ${id} for job: ${jId}`);
		$.ajax("/api/note/" + id, {
			type :"DELETE",
			data: { a_id: jId }
	    }).then( function(){
	    	$('#saved-notes').find(`[data-note='${id}']`).hide();
	        // location.reload();
	    });		
	});

	$('#scrape-modal').on('hide.bs.modal', function (e) {
	  	location.reload();
	});

	function scrape(){
	    $("#scrape_result").empty();
	    $.get("/api/scrape", function(data){
	    	// console.log(data);
	    	if(data){
	    		let scraped = $('<div>').addClass().text(`Scraped jobs: ${data.scraped},`);
	    		let saved = $('<div>').addClass().text(`Saved new jobs: ${data.stored}.`);
				$("#scrape_result").append(scraped).append(saved);
				$("#scrape-modal").modal("toggle");
	      	}
	    }); 
  	}

  	function showJobNotes(id){
  		$("#saved-notes").empty();
  		$("#new-note-txt").val('');
		$.get("/api/job-notes/"+id, function(data){
			if(data.notes && data.notes.length){
				data.notes.forEach(function(n){
					renderNote(n, id);
				});
			}
			// else{
			// 	$("#saved-notes").text("No notes for this job yet");
			// }
		});
		$("#add-note").attr("data-job", id);
		$("#job-modal").modal("toggle");
  	}

	function addNote(jId){
		$.post("/api/job-notes/" + jId, { 
			text: $("#new-note-txt").val().trim() 
	    }).then( function(data){
	    	// console.log(JSON.stringify(data));
	        location.reload();
	    });
	}

	function renderNote(note, jId){

		let note_item = $('<a>').addClass('list-group-item list-group-item-action note');
		note_item.attr('data-note', note._id);
		let note_div = $('<div>').addClass('container');
		let note_row = $('<div>').addClass('row');
		let txt_div = $('<div>').addClass('col-10').text(note.text);
		let del_div = $('<div>').addClass('col-2 right');
		let del_btn = $('<button>').attr('type', 'button').addClass('del-note-btn');
		del_btn.attr('data-id', note._id);
		del_btn.attr('data-j_id', jId);
		let icon = $('<i>').addClass('fa fa-close').attr('style','font-size:20px;color:white');
		del_btn.append(icon);
		del_div.append(del_btn);
		note_row.append(txt_div).append(del_div);
		note_div.append(note_row);
		note_item.append(note_div);

		$("#saved-notes").append(note_item);

	}

});