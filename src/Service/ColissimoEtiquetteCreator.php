<?php

namespace App\Service;

use Exception;
use SimpleXMLElement;
use SoapClient;
use SoapFault;

class ColissimoEtiquetteCreator
{
    const SERVER_NAME = 'https://ws.colissimo.fr';
    const LABEL_FOLDER = './labels/';
    const MY_LOGIN = '';
    const MY_PASSWORD = '';
    const COMPANY_NAME = 'CompanyName';
    const COMPANY_ADDRESS = '2 rue de blamable';
    const COMPANY_COUNTRY = 'FR';
    const COMPANY_CITY = 'Paris';
    const COMPANY_ZIPCODE = '75000';
    private string $stream;
    private string $parcelNumber;


    /**
     * @throws SoapFault
     * @throws Exception
     */
    public function generate($client, $colis): bool|static
    {
        $requestParameter = [
            'contractNumber' => self::MY_LOGIN,
            'password' => self::MY_PASSWORD,
            'outputFormat' => ['outputPrintingType' => 'ZPL_10x15_203dpi'],
            'letter' => [
                'service' =>
                    [
                        'productCode' => 'DOM',
                        'depositDate' =>  $colis['date']
                    ],
                'parcel' => [
                    'weight' => $colis['poid']
                ],
                'sender' => [
                    'address' => [
                        'companyName' => self::COMPANY_NAME,
                        'line2' => self::COMPANY_ADDRESS,
                        'countryCode' => self::COMPANY_COUNTRY,
                        'city' => self::COMPANY_CITY,
                        'zipCode' => self::COMPANY_ZIPCODE
                    ]
                ],
                'addressee' => ['address' => $client]
            ]
        ];
        $xml = new SimpleXMLElement('<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" />');
        $children = $xml
            ->addChild("soapenv:Header")
            ->addChild("soapenv:Body")
            ->addChild("sls:generateLabel", null, 'http://sls.ws.coliposte.fr')
            ->addChild("generateLabelRequest", null, "");
        $this->array_to_xml($requestParameter, $children);
        $requestSoap = $xml->asXML();
        $resp = new SoapClient(self::SERVER_NAME . '/sls-ws/SlsServiceWS/2.0?wsdl');
        $response = $resp->__doRequest($requestSoap, self::SERVER_NAME . '/sls-ws/SlsServiceWS/2.0', 'generateLabel', '2.0', 0);
        $parseResponse = new MTOM_ResponseReader($response);
        $resultat_tmp = $parseResponse->soapResponse;
        $soap_result = $resultat_tmp["data"];
        $error_code = explode("<id>", $soap_result);
        $error_code = explode("</id>", $error_code[1]);
        if ($error_code[0] == "0") {
            $resultat_tmp = $parseResponse->soapResponse;
            $soap_result = $resultat_tmp["data"];
            $resultat_tmp = $parseResponse->attachments;
            $label_content = $resultat_tmp[0];
            $my_datas = $label_content["data"];
            $my_extension_tmp = $requestParameter["outputFormat"]["outputPrintingType"];
            $my_extension = strtolower(substr($my_extension_tmp, 0, 3));
            $pieces = explode("<parcelNumber>", $soap_result);
            $pieces = explode("</parcelNumber>", $pieces[1]);
            $this->setStream($my_datas);
            $this->setParcelNumber($pieces);
        } else {
            $error_message = explode("<messageContent>", $soap_result);
            $error_message = explode("</messageContent>", $error_message[1]);
            throw new Exception($error_message[0], $error_code[0]);
        }
    }

    function setStream($stream): static
    {
        $this->stream = $stream;
        return $this;
    }
    function setParcelNumber($pieces): static
    {
        $this->parcelNumber = $pieces;
        return $this;
    }

    function getStream(): string
    {
        return $this->stream;
    }
   function getParcelNumber(): string
    {
        return $this->parcelNumber;
    }

    public function array_to_xml(array $phpResponse, SimpleXMLElement $phpResponseToXML)
    {
        foreach ($phpResponse as $key => $value) {
            if (is_array($value)) {
                if (!is_numeric($key)) {
                    $subnode = $phpResponseToXML->addChild("{$key}");
                } else {
                    if (current($phpResponseToXML->xpath('parent::*'))) {
                        $subnode = $phpResponseToXML->addChild("Showing");
                    } else {
                        $subnode = $phpResponseToXML->addChild("Show");
                    }
                }
                $this->array_to_xml($value, $subnode);
            } else {
                $phpResponseToXML->{$key} = $value;
            }
        }
    }
}