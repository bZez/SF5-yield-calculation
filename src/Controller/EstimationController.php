<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class EstimationController extends AbstractController
{
    #[Route('/_/estimation', name: 'estimation',methods: 'POST')]
    public function index(): Response
    {
        $request = Request::createFromGlobals();
        $auth = $request->get('auth');
        $response = $this->render('app/estimation/index.html.twig',[

        ])->getContent();
        if (!$this->isCsrfTokenValid('estimation', $auth))
            return new Response("<h1>Erreur</h1>");
        return new Response($response);
    }
}
