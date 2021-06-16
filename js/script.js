$(document).ready(function() {
	
	// VARIABLES
	const cards = [];
	let flippedCards = [];
	let score = {total: 0, tries: 0, pairs: 0, bonus: 1, info: ''};
	let delayed, delayed2;

	for(let i=0; i<=5; i++) {
		cards.push({id:cards.length, src:`./assets//card_${i}.png`});
		cards.push({id:cards.length, src:`./assets//card_${i}.png`});
	}

	// RANDOM SORT CARDS
	cards.sort(function(a, b) {
		return 0.5 - Math.random();
	});

	$('img').on('click', function(event) {
		flippedCards.push($(this));
		$(this).addClass('flipped');
		setTimeout(() => {
			$(this).attr('src', cards[$(this).attr('alt')].src)
		}, 200);
		if(flippedCards.length < 2) {
		// flipped first card
		} else {
			// flipped second card
			$('img').css('pointer-events', 'none');
			setTimeout(() => {
				flippedCards.forEach(card => {
					card.removeClass('flipped');
					if(flippedCards[0].attr('src') === flippedCards[1].attr('src')) {
						// finding pair success
						card.addClass('disabled');
						setTimeout(() => {
							$('img').not('.disabled').css('pointer-events', '')
						}, 200);
						clearTimeout(delayed);
						delayed = setTimeout(() => {
							score.total = (score.total + 100) * score.bonus;
							score.bonus += 1;
							score.pairs += 1;
						}, 200);
					} else {
						// finding pair failed
						setTimeout(() => {
							card.addClass('flipped');
							setTimeout(() => card.attr('src', './assets/card_back.png'), 200);
							setTimeout(() => card.removeClass('flipped'), 300);
							$('img').css('pointer-events', '');
						}, 400);
						clearTimeout(delayed);
						delayed = setTimeout(() => {
							score.bonus = 1;
						}, 400);
					}
					clearInterval(delayed2);
					delayed2 = setTimeout(() => {
						flippedCards = [];
						score.tries += 1;
						if(score.bonus === 2) {
							score.info = "GOOD";
							score.color = 'red';
						} else if(score.bonus === 3 || score.bonus === 4) {
							score.info = "NICE";
							score.color = 'orange';
						} else if(score.bonus === 5 ) {
							score.info = 'GREAT';
							score.color = 'cornflowerblue';
						} else if(score.bonus === 6) {
							score.info = 'PERFECT';
							score.color = 'green';
						}
						$('.bonus-info').text(score.info).css({color: score.color});
						$('#tries').text(score.tries);
						$('#score').text(score.total);
						console.log(score);
					}, 300);
				});
			}, 300)
		}
	});

	const scoreUpdate = () => {

	}
})