<?php

namespace App\Controller;

use App\Entity\Etiquette;
use App\Service\ColissimoEtiquetteCreator;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use http\Env\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class ColissimoController extends AbstractController
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @throws Exception
     */
    #[Route('/_/etiquette', name: 'etiquette', methods: 'POST')]
    public function index(): Response|RedirectResponse|JsonResponse
    {
        $request = Request::createFromGlobals();
        if ($this->isCsrfTokenValid('etiquette', $request->get('auth'))) {
            $now = new \DateTimeImmutable();
            $etiquette = new ColissimoEtiquetteCreator();
            $client = [
                'lastName' => 'lastName',
                'firstName' => 'firstName',
                'line2' => 'address',
                'countryCode' => 'country_code',
                'city' => 'city',
                'zipCode' => 'zip_code'
            ];
            $colis = [
                'poid' => 10,
                'date' => $now->format('Y-m-d')
            ];
            try {
                $etiquette->generate($client, $colis);
            } catch (Exception $e) {
                return $this->json(['erreur' => $e->getMessage(), 'code' => $e->getCode()]);
            }
            $etiquette = new Etiquette($etiquette->getParcelNumber(), $etiquette->getStream(), $now);
            $this->em->flush();
            return $this->json(['etiquette' => $etiquette->getId()]);
        }
        return new Response("<h1>Error !</h1>");
    }
}
