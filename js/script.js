$(document).ready(function() {

	$(document.body).on('click', '.table-score', function() {
		$(this).fadeOut();
		setTimeout(() => $(this).remove(), 200);
	})
	$('.show-top-btn').on('click', function(event) {
		showScore(event);
	})

	$(document.body).on('click', '#saveScore', function(event) {
		event.preventDefault();
		const thisEl = $(this);
		const calculateScore = (score.total/score.tries) + (score.total/(minutes + seconds.toFixed(2)));
		const data = {
			name: $('input[name="name"]').val(),
			points: calculateScore.toFixed(0),
			game_time: showTime
		}
		thisEl.attr('disabled', true);
		$.post('http://localhost/pairs_score/', data, function(res) {
			$('.input-name').remove();
			showScore(event);
		})
	})

	$(document.body).on('click', '.restart-btn', function(event) {
		event.preventDefault();
		window.location.reload();
	})


	$('img').on('click', function(event) {
		// start game
		if(score.pairs < 1) {
			startGame = true;
		}
		if(startGame) {
			stopCounting(startCounting);
			startCounting = setInterval(counting, 10);
		}

		flippedCards.push($(this));
		$(this).addClass('flipped');
		setTimeout(() => {
			$(this).attr('src', cards[$(this).attr('alt')].src)
		}, 200);
		if(flippedCards.length < 2) {
		// flipped first card
		$('img').css('pointer-events', 'none');
		setTimeout(() => $('img').css('pointer-events', ''), 10);
		} else {
			timeCountingHandler = null;
			// flipped second card
			startGame = false;
			$('img').css('pointer-events', 'none');
			setTimeout(() => {
				flippedCards.forEach(card => {
					card.removeClass('flipped');
					if(flippedCards[0].attr('src') === flippedCards[1].attr('src')) {
						// finding pair success
						card.addClass('disabled');
						setTimeout(() => {
							$('img').not('.disabled').css('pointer-events', '')
						}, 300);
						clearTimeout(delayed);
						delayed = setTimeout(() => {
							score.bonus += 1;
							score.total = (score.total + 100) * score.bonus;
							score.pairs += 1;
							$('#score').removeClass('pulse');
							setTimeout(() => $('#score').text(score.total).addClass('pulse'), 100);
							// end game
							if(score.pairs > 5) {
								$.get('http://localhost/pairs_score/', function(res) {
									const calc = (score.total/score.tries) + (score.total/(minutes + seconds.toFixed(2)));
									stopCounting(startCounting);
									$('.board').append(restartButton);
									if(res.length >= 10) {
										if(res[9].points < calc) {
											$(document.body).append(inputEl);
										} else {
											showScore(event);
										}
									} else {
										$(document.body).append(inputEl);
									}
								});
							}
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
						setTimeout(() => {
							$('#tries').text(score.tries);
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

	// VARIABLES
	const cards = [];
	let startGame = false;
	let flippedCards = [], delayed, delayed2; 
	let time = 0.00, minutes = 0, seconds = 0.00, startCounting, showTime;
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
	const inputEl = `
		<div class="input-name">
			<div>
				<label>
					Enter your name:<br>
					<input type="text" name="name" autocomplete="off">
				</label>
				<div>
					<button id="saveScore">Save</button>
					<button class="restart-btn">Restart</button>
				</div>
			</div>
		</div>
	`;
	const showScore = (event) => {
		event.preventDefault();
		$(document.body).append(tableEl);
		$.get('http://localhost/pairs_score/', function(res) {
			res.forEach((person, index) => {
				$('.table-score tbody').append(rowEl(index, person.name, person.points, person.game_time, person.time));
			})
		})
	};
	const rowEl = (index, name, points, time, dateRecord) => `
		<tr>
			<td>${index<3 ? '&#9733; ' + (index + 1) : index + 1}</td>
			<td>${name}</td>
			<td>${points}</td>
			<td>${time}</td>
			<td>${dateRecord}</td>
		</tr>
	`;
	const restartButton = `
		<div class="restart-board-btn">
			<button class="restart-btn">Restart</button>
		</div>
	`;
	const tableEl = `
		<div class="table-score">
			<div>
				<table>
					<thead>
						<tr>
							<th>Place</th>
							<th>Name</th>
							<th>Points</th>
							<th>Time</th>
							<th>Date record</th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
			</div>
		</div>
	`;
	for(let i=0; i<=5; i++) {
		cards.push({id:cards.length, src:`./assets//card_${i}.png`});
		cards.push({id:cards.length, src:`./assets//card_${i}.png`});
	}
	// RANDOM SORT CARDS
	cards.sort(function(a, b) {
		return 0.5 - Math.random();
	});
	const counting = () => {
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
	}

	const stopCounting = (counting) => {
		clearInterval(counting);
	}
});
