$(document).ready(function() {
	
	// VARIABLES
	const cards = [];
	let startGame = false;
	let flippedCards = [], delayed, delayed2;
	let score = {total: 0, tries: 0, pairs: 0, bonus: 1, info: ''};
	const scoreArray = [
		{ bonus: 1, info: '', color: '' },
		{ bonus: 2, info: '', color: '' },
		{ bonus: 3, info: 'GOOD', color: 'red' },
		{ bonus: 4, info: 'NICE', color: 'orange' },
		{ bonus: 5, info: 'GREAT', color: '#f0cb43' },
		{ bonus: 6, info: 'SUPERB', color: '#adf043' },
		{ bonus: 7, info: 'PERFECT', color: 'green' }
	];

	for(let i=0; i<=5; i++) {
		cards.push({id:cards.length, src:`./assets//card_${i}.png`});
		cards.push({id:cards.length, src:`./assets//card_${i}.png`});
	}

	// RANDOM SORT CARDS
	cards.sort(function(a, b) {
		return 0.5 - Math.random();
	});

	// time
	let time = 0.00;
	let minutes = 0;
	let seconds = 0.00;
	let timeCounting;
	
	const timeCountingHandler = () => {
		if(startGame) {
			clearInterval(timeCounting);
			timeCounting = setInterval(() => {
				let showTime;
				time += 0.01;
				seconds += 0.01;
				if(time > 60.00) {
					minutes = (time/60).toString();
					minutes = minutes.split('.')[0];
					if((minutes * seconds.toFixed(2)) >= time.toFixed(2)) {
						seconds = 0.00;
					}
					showTime = `${minutes} min  ${seconds.toFixed(2)} sec`;
				} else {
					showTime = `${seconds.toFixed(2)} sec`;
				}
				$('.time').text(showTime);
			}, 10);
		}
	}

	$('img').on('click', function(event) {
		startGame = true;
		timeCountingHandler();
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
						scoreArray.forEach((item) => {
							if(score.bonus === item.bonus) {
								score.info = item.info;
								score.color = item.color
							}
						})
						$('.bonus-info').removeClass('pulse');
						$('#score').removeClass('pulse');
						setTimeout(() => {
							$('#tries').text(score.tries);
							$('#score').text(score.total).addClass('pulse');
							setTimeout(() => {
								$('.bonus-info').addClass('pulse');
								$('.bonus-info').text(score.info).css({color: score.color});
							}, 100);
						}, 100);
					}, 400);
				});
			}, 300);
		}
	});
});