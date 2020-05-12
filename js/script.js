$(document).ready(function() {
	
const cards = [];
const flippedCards = [];
let score = {total: 0, tries: 0, pairs: 0}
let toggle = false;

for(let i=0; i<=5; i++) {
	cards.push({id:cards.length, src:`./assets//card_${i}.png`});
	cards.push({id:cards.length, src:`./assets//card_${i}.png`});
}

cards.sort(function(a, b) {
	return 0.5 - Math.random()
})


/* CLICK CARD */
cards.map((card, index) => {
	$("img").eq(index).click(function() {
		if($(this).attr("id") != "pair") {

			/* FIRST CARD */
			if(toggle === false) {
				$(this).transition({
					scaleX: 0
				},200);
				setTimeout(() => {
					$(this).attr("src", card.src);	// CHANGING FIRST CARD TO ANIMAL
					flippedCards[0] = card.src;
					$(this).attr("id", "flipped1");
					$(this).attr("id", "flipped");
					$(this).transition({
						scaleX: 1
					},200)
				},200)
				
				toggle = true	// SWITCHING TO SECOND CARD
			}
	
			/* SECOND CARD */
			else {
				toggle = false;
				if($(this).attr("src") === "./assets//card_back.png") {
					$(this).transition({
						scaleX: 0
					},200)
					setTimeout(() => {
						$(this).attr("src", card.src);	// CHANGING SECOND CARD TO ANIMAL
						flippedCards[1] = card.src;
						$(this).attr("id", "flipped2");
						$(this).attr("id", "flipped");
						$(this).transition({
							scaleX: 1
						},200);
					},200)
					$("img").css("pointer-events", "none");
					setTimeout(() => {
						if(flippedCards[0] === flippedCards[1]) {	// FLIP CARDS WHEN SUCCESS
							$("img#flipped").transition({
								opacity: 0
							},400);
							$("img#flipped").attr("id", "pair");
							$(".earn-point").transition({
								opacity: 1,
								bottom: 200
							}, 1000)
							setTimeout( () => {
								$(".earn-point").transition({
									opacity: 0
								})
								setTimeout(() => {
									$(".earn-point").css({bottom: 0})
								},600)
							}, 1000)
							score.total += 1;
							score.tries += 1;
							score.pairs += 1;
						}
						else {
							$("img#flipped").transition({	// FLIP CARDS WHEN MISS
								scaleX: 0
							},200)
							$("img").attr("src", "./assets//card_back.png");	//FLIP BACK ALL CARDS
							setTimeout(() => {
								$("img#flipped").transition({
									scaleX: 1
								},200)
								$("img#flipped").attr("id", "");					
							},200);
							score.total -= 1;
							if(score.total < 0) {
								score.total = 0
							}
							score.tries += 1;
						}
							$("img").css("pointer-events", "auto");
							$("img#pair").css("pointer-events", "none");
						flippedCards[0] = null;
						flippedCards[1] = null;
						/* DISPLAY SCORE */
						$(".score p").eq(0).html(`Your tries <br> <span>${score.tries}</span>`);
						$(".score p").eq(1).html(`Your score <br> <span>${score.total}</span>`);

						/* END GAME */
						if(score.pairs === 6) {
							$("<div class='overlay'><input type='button' value='restart game'></div>").appendTo("body")
						}
						$(".overlay input").click(() => {
							location.reload();
						})
					},1000)
				}
			}

		}
	})
})



})