/**
 *	Theme Name:		iA³
 *	Theme URI:		http://informationarchitects.jp/
 *	Author:			Information Architects,Inc
 *	Version:		1.1.A
 **/

ia3 = {
	listeners: {
		hasInitialized: function() {
			$("*:first-child").addClass("firstChild");
			$("*:last-child").addClass("lastChild");
			twttr.anywhere(function(b) {
				b("a.twooser").hovercards({
					username: function(a) {
						return a.text;
					}
				});
				b("img.twooser").hovercards({
					username: function(a) {
						return a.alt;
					}
				});
			});
			$(document).trigger("CORE:HAS_RESIZED");
		},
		hasResized: function() {
			var b = $(document).width();
			if (b > 1024) {
				if (typeof $.fancybox == "function") {
					$(".containsGallery a,.eStore-thumbnail a, a.enlarge").fancybox();
				}
				if ($("#screen > header > form").length == 1) {
					$("#screen > header > form").remove();
				}
			} else {
				if (typeof $.fancybox == "function") {
					$(".containsGallery a,.eStore-thumbnail a, a.enlarge").unbind("click.fb");
				}
				if ($("#screen > header > form").length == 0) {
					$("#footerOne > li:nth-child(1) > form").clone().insertBefore("#screen > header > h1");
				}
				if (b > 595) {
					if ($("#screen > header > form fieldset").length == 2) {
						$("#screen > header > form fieldset:nth-child(2)").remove();
					}
				} else {
					if ($("#screen > header > form fieldset").length == 1) {
						$("#screen > header > form").append('<fieldset><label for="mobile-menu"></label><select id="mobile-menu"><option value="' + window.BASE_URL + '">Home</option></select><select id="mobile-lang"></select></fieldset>');
						$("#screen > header > nav > ul").each(function(f) {
							var a = $(this),
								e = f + 1;
							$("li li a", a).each(function() {
								if ($(this).parent().is("strong")) {
									$("#screen > header > form select:nth-of-type(" + e + ")").append('<option selected value="' + $(this).attr("href") + '">' + $(this).text() + "</option>");
								} else {
									$("#screen > header > form select:nth-of-type(" + e + ")").append('<option value="' + $(this).attr("href") + '">' + $(this).text() + "</option>");
								}
							});
						});
						$("#mobile-lang, #mobile-menu").change(function() {
							window.location.href = $(this).val();
						});
					}
				}
			}
		},
		foundTweetlist: function() {
			var e = "",
				g = {},
				f = $("#containsTweets"),
				h = $("#containsTwoosers");
			$(document).bind("CORE:FOUND_TWEETS:FETCH", function() {
				$.getJSON("http://search.twitter.com/search.json?callback=?&rpp=10&q=" + e.replace(/\+OR\+$/, ""), function(a) {
					if (typeof a.results == "object" || typeof a.results == "array") {
						g = a.results;
						$(document).trigger("CORE:FOUND_TWEETS:UPDATE");
					}
				});
			});
			$(document).bind("CORE:FOUND_TWEETS:UPDATE", function() {
				f.empty();
				for (var b in g) {
					var a = g[b];
					a.text = a.text.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/g, '<a href="$1">$1</a>');
					a.text = a.text.replace(/\@(\w+)/g, '<a class="twooser" href="http://twitter.com/$1">@$1</a>');
					f.append('<li><img alt="" src="' + a.profile_image_url + '" /><blockquote><p><a class="twooser" href="http://twitter.com/' + a.from_user + '">' + a.from_user + "</a>: " + a.text + '</p></blockquote><p><a href="http://twitter.com/' + a.from_user + "/status/" + a.id + '/">' + $.timeago(a.created_at) + "</a></p></li>");
				}
				setTimeout(function() {
					$(document).trigger("CORE:FOUND_TWEETS:FETCH");
				},
				180000);
			});
			$("li h2 a", h).each(function() {
				e += "from%3A" + $(this).html() + "+OR+";
			});
			$(document).trigger("CORE:FOUND_TWEETS:FETCH");
		}
	}
};
$(document).bind("CORE:HAS_INITIALIZED", ia3.listeners.hasInitialized).bind("CORE:HAS_RESIZED", ia3.listeners.hasResized).bind("CORE:FOUND_TWEETLIST", ia3.listeners.foundTweetlist);
