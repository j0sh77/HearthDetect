$().ready(function() {
	$('.card-image').on('click', function() {
		var fields = $.parseJSON($(this).parent().attr('data-fields'));

		// Set fields on form
		$.each(fields, function(input, value) {
			input = input.replace('[', '\\[').replace(']', '\\]');
			if ($('[id = ' + input + ']').attr("type") == "checkbox") {
				$('[id = ' + input + ']').prop('checked', value == "1");
			} else {
				$('[id = ' + input + ']').val(value);
			}
		});

		$('.card-container').show();
	});

	$('.btn-add-card').on('click', function() {
		$('#card').trigger('reset');
		$('#card #id').val("-1");
		$('.card-container').show();
	});

	$('.modal-container-close').on('click', function() {
		$('.modal-container').hide();
	});

	$('.btn-save').on('click', function() {
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "php/ajax.php",
			data: {
				call: 'save_card',
				form: $('#card').serialize()
			},
			success: function(data) {
				if (data.success) {
					var fields = $.parseJSON(data.output);

					if (data.new) {
						// TODO: actually handle new card display
						location.reload();

						// var card = $('.card-template').clone();
						// card.removeClass('.card-template');
						// card.show();
					} else {
						var card = $('.card[data-id=' + fields['id'] + ']');
					}

					card.attr('data-fields', data.output);
					card.find('.card-image').css('background-image', 'url(' + fields['img'] + ')');
					card.find('.card-title').text(fields['name']);

					$('.modal-container').hide();
				} else {
					alert(data.output);
				}
			}
		});
	});

	$('.card-delete').on('click', function(event) {
		event.stopPropagation();

		var card = $(this).parents('.card');
        
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "php/ajax.php",
			data: {
				call: 'delete_card',
				card_id: card.attr('data-id')
			},
			success: function(data) {
				if (data.success) {
					card.remove();
				} else {
					alert(data.output);
				}
			}
		});
	});
});
