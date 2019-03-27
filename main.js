"use strict";
function format(number, decPlaces) {
    if (decPlaces === void 0) { decPlaces = 2; }
    var ret = "";
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10, decPlaces);
    // Enumerate number abbreviations
    var abbrev = [" thousand", " million", "B", "T", "q", "Q", "s", "S", "O", "N", "D"];
    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {
        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10, (i + 1) * 3);
        // If the number is bigger or equal do the abbreviation
        if (size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            number = Math.round(number * decPlaces / size) / decPlaces;
            // Handle special case where we round up to the next abbreviation
            if ((number == 1000) && (i < abbrev.length - 1)) {
                number = 1;
                i++;
            }
            // Add the letter for the abbreviation
            ret = number.toString() + abbrev[i];
            // We are done... stop
            break;
        }
    }
    return ret;
}
function fame(percent) {
    if (percent < 0.05) {
        return "a word used for a brief period, then forgotten.";
    }
    if (percent < 0.1) {
        return "a word used for a little while, and becomes a meme for a month or two.";
    }
    if (percent < 0.3) {
        return "a word retweeted across america, having widespread audience, and lasting for six months.";
    }
    if (percent < 0.5) {
        return "a word that is adopted across the dankest memes, and becomes a minor part of slang (for a year or so).";
    }
    if (percent < 0.75) {
        return "a word that jumps into the minds of teenages and spreads through memes, becoming an accepted slang word.";
    }
    if (percent < 1) {
        return "a word that easily dominates memes, pop culture, and slang for the next two years.";
    }
    if (percent < 1.5) {
        return "a word that is used within certain regions with frequency, and becomes generaitional slang that fades within the decade.";
    }
    if (percent < 1.75) {
        return "a word that becomes a lasting slang word, and is used until the end of the generation.";
    }
    return "a word that becomes slang within months, and actually has a chance of being adopted into English.";
}
var celeb = document.querySelector("[name=\"celeb\"]");
var word = document.querySelector("input[type=\"text\"]");
var submit = document.querySelector("button[type=\"submit\"]");
var viewArea = document.querySelector("#views");
var canvas = document.querySelector("#america");
var ctx = canvas ? canvas.getContext("2d") : void 0;
var america = document.querySelector("[src=\"america.jpeg\"");
var inputForm = document.querySelector("#inputForm");
var viewDisplay = document.querySelector("#totalViews");
var result = document.querySelector("#result");
var usPopulation = 3.272e8;
var views = 0;
var finalViews = 0;
var followers = 0;
var viewMomentum = 1;
var viewId;
var percent;
function viewAmount(followers) {
    var viewsCount = 0;
    viewsCount += followers / 20;
    var retweets = followers * 0.00028;
    var retweet = Math.random() < retweets;
    return Math.floor(viewsCount + ((retweet) ? viewAmount(707 * retweets) : 0));
}
function randInt(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}
var celebsToFollowers = {
    "Katy Perry": 1.07e8,
    "Barack Obama": 1.05e8,
    "Justin Bieber": 1.05e8,
    "Taylor Swift": 8.32e7,
    "Lady Gaga": 7.83e7,
    "Donald Trump": 5.93e7,
    "Selena Gomez": 5.73e7,
    "Britney Spears": 5.64e7,
    "Bill Gates": 4.68e7
};
if (submit) {
    submit.addEventListener("click", function (e) {
        e.preventDefault();
        if (celeb && word && celeb.value && word.value) {
            swal("Let's see what happens!", "Now, you can watch your word spread across America!", "success");
            followers = celebsToFollowers[celeb.value];
            views = viewAmount(followers);
            if (viewArea) {
                if (inputForm) {
                    inputForm.setAttribute("hidden", "true");
                }
                viewArea.removeAttribute("hidden");
                if (ctx) {
                    if (america) {
                        ctx.drawImage(america, 0, 0);
                    }
                    if (viewDisplay) {
                        setInterval(function () {
                            viewDisplay.innerHTML = "Total views:  " + format(finalViews);
                        });
                    }
                    viewId = setInterval(function () {
                        if (views < 1) {
                            clearInterval(viewId);
                        }
                        if (randInt(1, views * (1000 + viewMomentum / 2)) < views * viewMomentum) {
                            if (viewMomentum < 30)
                                viewMomentum++;
                            views += viewAmount((views > 1e6) ? 5e5 : views / 3);
                        }
                        if (views > 0) {
                            if (views * 0.001 > 100) {
                                finalViews += views * 0.001;
                                views -= views * 0.001;
                            }
                            else {
                                finalViews += 100;
                                views -= 100;
                            }
                            ctx.fillStyle = "Orange";
                            ctx.beginPath();
                            ctx.arc(randInt(0, 600), randInt(0, 400), 1, 0, 360);
                            ctx.fill();
                        }
                        else {
                            percent = (finalViews / usPopulation) * 100;
                            if (result) {
                                result.innerHTML = "Your word reached " + percent.toFixed(3) + "% of the population.\n                                                    You word becomes " + fame(percent);
                            }
                            clearInterval(viewId);
                        }
                    }, 1);
                }
            }
        }
        else {
            swal("Uh oh...", "Please fill out both form fields.", "error");
        }
    });
}
