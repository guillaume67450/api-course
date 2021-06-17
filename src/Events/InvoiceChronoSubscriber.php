<?php

namespace App\Events;

use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceChronoSubscriber implements EventSubscriberInterface {

    private $security;
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event) {
        // 1. J'ai besoin de trouver l'utilisateur actuellement connecté (Security)
        // 2. J'ai besoin du repository des factures (InvoiceRepository)
        // 3. Choper la dernière facture qui a été insérée, et choper son chrono
        // 4. Dans cette nouvelle facture, on donne le dernier chrono + 1

        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($invoice instanceof Invoice && $method === "POST") {
            $nextChrono = $this->repository->findNextChrono($this->security->getUser());
            $invoice->setChrono($nextChrono);

            // TODO : à déplacer éventuellement dans une classe dédiée qui parle des dates (rien d'obligatoire cependant)
            if(empty($invoice->getSentAt())) {
                $invoice->setSentAt(new \DateTime());
            }

        }
    }
}