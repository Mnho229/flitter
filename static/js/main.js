//Makes the POST request to the Server.  Server then returns 'data' in the param and allows use of it via a callback
$.post('/currProfile').done(function(data) {
    if (typeof data === "string") //if the promise from the server returned the string
    {
        $(".navbar").prepend("<p>" + data + "</p>"); //Add to beginning of parent element(first child)
    }
    else
    {
        //Generate profile picture and grabbed username and name of current user
        $(".navbar").prepend( makeProfilePic(data[0].username) + "<p>Username: " + data[0].username + "<br>Name: " + data[0].fname + " " + data[0].lname + "</p>");
    }
});
//click handler of Fleets
$("#fleets").click(function() {
    deconstruct();
    //Grab the numbers from the input fields
    var x = $('input[name="numFleets"]').val();
    var y = $('input[name="startingFleet"]').val();
    //Asynchronus Javascript Request for POST
    $.ajax({
        type: "POST",
        url: "/generateFleets",
        data: {limit: x, offset: y}
    })
    .done(function(data) {
        //Append the grabbed fleets to the div element
        for (var i = 0; i < data.length; i++) {
            $(".construct").append("<div class='decon'>" + makeProfilePic(data[i].username) + "<b>" + data[i].username + "</b><p>" + data[i].content + "</p></div>");
        }
    });
    $(".construct").addClass("scroll");
});

// Add a fleet click handler
$("#addFleet").click(function() {
    var theContent = $('textarea[name="postfleet"]').val();
    if (theContent == "") {
        alert("No content!");
    }
    else {
        $.ajax({
            type: "POST",
            url: "/fleet",
            data: {content: theContent}
        })
        .done(function(value) {
            alert(value);
        });
        theContent = "";
        $('textarea[name="postfleet"').val("");
        
    }
    $(".construct").addClass("scroll");
});

//Click handler for showing followers. Adds an unfollow link with the pid attached to the id.
$("#showfollowers").click(function() {
    deconstruct();
    $.post('/showfollowers')
        .done(function(rows) {
            if (!rows) //if no results
            {
                $(".construct").append("<div class = 'decon'><p>Nobody here but us trees...</p></div>");
            }
            for (var i = 0; i < rows.length; i++)
            {
                $(".construct").append("<div class = 'decon'>" + makeProfilePic(rows[i].username) + "<b>" + rows[i].username + "</b><p>Name: " + rows[i].fname + " " + rows[i].lname + "<br>Location: " + rows[i].location + "  </p><a id = 'unfollow" + i +"'><div class='unfollow'>Unfollow</div></a></div>");
                $("#unfollow" + i).data("pid", rows[i].pid); //attach data
            }
        });
    $(".construct").addClass("scroll");
});

//Click handler for the unfollow button (on function for dynamically generated content)
$(".construct").on("click", "a", function() {

    if ( $(this).is('[id*="unfollow"]') )
    {
        var grabbedpid = $(this).data("pid");
        $.ajax({
            type: "POST",
            url: "/removefollower",
            data: {content: grabbedpid}
        })
        .done(function(value) {
            alert(value);
        });
    }
    else if ( $(this).is('[id*="follow"]') )
    {
        var grabbedpid = $(this).data("pid");
        $.ajax({
            type: "POST",
            url: "/follow",
            data: {content: grabbedpid}
        })
        .done(function(value) {
            alert(value);
        });
    }
});

//Click handler for non-followed Fleeters
$("#nonfollowers").click(function() {
    deconstruct();
    $.post('/suggestions').done(function(rows) {
        if (!rows)
        {
            $(".construct").append("<div class = 'decon'><p>Nobody here but us trees...</p></div>");
        }
        for (var i = 0; i < rows.length; i++)
        {
            $(".construct").append("<div class = 'decon'>" + makeProfilePic(rows[i].username) + "<b>" + rows[i].username + "</b><p>Name: " + rows[i].fname + " " + rows[i].lname + "<br>Location: " + rows[i].location + "  </p><a id = 'follow" + i +"'><div class = 'follow'>Follow</div></a></div>");
            $("#follow" + i).data("pid", rows[i].pid);
        }
    });
});

//POST request for logging out
$('#logout').click(function() {
    $.post('/logout').done(function(value) {
        window.location = value.redirect;
    });
});

//Removes the dynamically generated content with the class name decon
var deconstruct = function()
{
    $(".decon").remove();
    $(".construct").removeClass("scroll");
};

//Makes the custom profile picture made out of the first two letters of the username.
var makeProfilePic = function(user)
{
    return "<div class ='profilePic'>" + user.substring(0,2) + "</div>";
}


