<?php
    header('Content-type: application/json');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    $request = json_decode(file_get_contents("php://input"));
    
    $obj = $request->formValues;
    
    $array = get_object_vars($obj);
    
    $from_email = $request->fromemail;

    $block_hash = $request->hash;

    $block_number = $request->blocknumber;

    $tx_id = $request->txid;

    $from_name = $request->appname;
    
    $my_subject = $request->subject;
    
    $to_email = $request->toemail;

    $contact = "<p><strong>Name:</strong>$from_name</p><p><strong>Email:</strong> $from_email</p>";

    $email_subject = "$from_name: $my_subject";

    $email_body = '<html><body>';
    $email_body .= "
    <p><strong>Name:</strong> $from_name</p>
    <p><strong>Email:</strong> $from_email</p>
    <p><strong>Block Number:</strong> $block_number</p>
    <p><strong>Hash:</strong> $block_hash</p>
    <p><strong>Tx ID:</strong> $tx_id</p>";
    $email_body .= '</body></html>';

    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
    $headers .= "From: $from_email\n";
    $headers .= "Reply-To: $from_email";

    mail($to_email,$email_subject,$email_body,$headers);

    $response_array['status'] = 'success';
    $response_array['from'] = $from_email;

    echo json_encode($response_array);
    echo json_encode($from_email);
    header($response_array);
    return $from_email;
?>