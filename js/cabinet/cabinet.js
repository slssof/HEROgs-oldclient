/**
 * Created by slshome on 13.11.14.
 */
$(function() {
        $('#modal-mainContainer').modal('show');

        $( '#sozdPers' ).on('click', function(){
            $('#modal-mainContainer').modal('hide');
            $('#modal-genPers').modal('show');
        });
    }
);