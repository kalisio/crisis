(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{522:function(e,t,n){e.exports=n.p+"assets/img/Event-Workflow-1-FR.95c07da8.png"},523:function(e,t,n){e.exports=n.p+"assets/img/Event-Workflow-2-FR.743e85f3.png"},524:function(e,t,n){e.exports=n.p+"assets/img/Interaction-FR.77b2aae6.png"},525:function(e,t,n){e.exports=n.p+"assets/img/Event-Map-FR.dbb46864.png"},560:function(e,t,n){"use strict";n.r(t);var i=n(13),a=function(e){e.options.__data__block__={mermaid_382ee16d:"graph TD\n  E[Création de l'événement] --\x3e |Notification| P1(Participant)\n  P1 --\x3e |Question| Q1{Disponible ?}\n  Q1 --\x3e |Oui| C(Coordonnateur)\n  Q1 --\x3e |Non| F1[Fin de l'interaction]\n  C --\x3e |Question| Q2{Engager ?}\n  Q2 --\x3e |Oui - Notification| P2(Participant)\n  Q2 --\x3e |Non - Notification| F2[Fin de l'interaction]"}},s=Object(i.a)({},(function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[i("h1",{attrs:{id:"processus"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#processus"}},[e._v("#")]),e._v(" Processus")]),e._v(" "),i("p",[e._v("Par défaut un modèle d'événement est un simple message informatif sans possibilité d’interaction entre les participants et les coordonnateurs.")]),e._v(" "),i("p",[e._v("L'ajout d'un "),i("strong",[e._v("processus")]),e._v(" permet de définir une "),i("em",[e._v("séquence d'interactions")]),e._v(" (i.e. questions à choix multiples) auxquelles doivent répondre le participant et/ou le coordonnateur de l'événement.")]),e._v(" "),i("p",[e._v("Un processus en deux étapes pourrait être celui-ci:")]),e._v(" "),i("ol",[i("li",[e._v("interaction du participant attendue: "),i("em",[e._v("êtes-vous disponible ou indisponible pour intervenir sur cet événement ?")])]),e._v(" "),i("li",[e._v("réponse du coordonnateur attendue: "),i("em",[e._v("je vous engage ou je ne vous engage pas sur cet événement")])])]),e._v(" "),i("div",{staticClass:"custom-block tip"},[i("p",{staticClass:"custom-block-title"},[e._v("Astuce")]),e._v(" "),i("p",[e._v("Chaque réponse du coordonnateur à la question d'une étape du processus engendre la génération d'une notification vers le participant destinataire.")])]),e._v(" "),i("Mermaid",{attrs:{id:"mermaid_382ee16d",graph:e.$dataBlock.mermaid_382ee16d}}),i("h2",{attrs:{id:"definition"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#definition"}},[e._v("#")]),e._v(" Définition")]),e._v(" "),i("p",[e._v("En pratique, un éditeur dédié permet de définir chaque étape au sein de l'application, par exemple son titre et la question à laquelle les intervenants devront répondre. Pour notre exemple la configuration de la première étape ressemblerait à ceci:")]),e._v(" "),i("p",[i("img",{attrs:{src:n(522),alt:"workflow-step-1"}})]),e._v(" "),i("p",[e._v("Et celle de la seconde étape ressemblerait à ceci:")]),e._v(" "),i("p",[i("img",{attrs:{src:n(523),alt:"workflow-step-2"}})]),e._v(" "),i("p",[e._v("👉 Vous êtes gestionnaire d'une organisation ? "),i("tour-link",{attrs:{text:"Voir comment créer un modèle avec processus",path:"home",params:{organisation:"manager",route:"create-event-template"}}})],1),e._v(" "),i("h2",{attrs:{id:"execution"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#execution"}},[e._v("#")]),e._v(" Exécution")]),e._v(" "),i("p",[e._v("Lors de la réception de l'événement par un intervenant l'application lui demandera de choisir parmi les réponses possibles et le fera avancer à l'étape suivante du processus, ou stoppera ses interactions à ce niveau, suivant sa réponse. A chaque étape un commentaire libre optionnel peut permettre de fournir des informations supplémentaires:")]),e._v(" "),i("p",[i("img",{attrs:{src:n(524),alt:"workflow-interaction"}})]),e._v(" "),i("p",[e._v("Le coordonnateur dispose quant à lui d'une "),i("em",[e._v("vue cartographique")]),e._v(" synthétisant la position des intervenants et leur état d'avancement selon l'icônographie définie dans le processus. En un clin d'oeil il visualise la liste des participants ayant reçu l'événement ainsi que leur réponses. Il sait également qu'il doit engager une interaction avec ceux attendant une réponse de sa part conformément à la définition du processus grâce à une icône dédiée:")]),e._v(" "),i("p",[i("img",{attrs:{src:n(525),alt:"workflow-map"}})])],1)}),[],!1,null,null,null);"function"==typeof a&&a(s);t.default=s.exports}}]);