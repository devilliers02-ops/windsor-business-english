/* Content data. Every learner-facing string carries en + fr. */
window.WBE_DATA = (function () {
  function s(en, fr, tipEn, tipFr) { return { en: en, fr: fr, tip: { en: tipEn, fr: tipFr } }; }
  function g(p, label, note, sents) { return { p: p, label: label, note: note, s: sents }; }

  var PREP = {
    time: [
      g('AT', { en: 'Exact time', fr: 'Heure précise' }, { en: 'AT + clock time or fixed point', fr: 'AT + heure ou moment fixe' }, [
        s('The board meeting starts <b>at</b> 9 a.m. sharp.', 'La réunion du conseil commence à 9 h précises.', 'Use AT for clock times.', 'Utilisez AT pour une heure précise.'),
        s('We close the books <b>at</b> the end of Q3.', 'Nous clôturons les comptes à la fin du T3.', 'AT the end / AT the beginning of a period.', 'AT the end / AT the beginning of… pour une période.'),
        s('Please reply <b>at</b> your earliest convenience.', 'Merci de répondre dès que possible.', 'A polite fixed phrase for emails.', 'Formule de politesse figée pour les e-mails.')]),
      g('ON', { en: 'Days and dates', fr: 'Jours et dates' }, { en: 'ON + days and dates', fr: 'ON + jours et dates' }, [
        s('The report is due <b>on</b> Friday.', 'Le rapport est attendu vendredi.', 'ON + days of the week.', 'ON + jours de la semaine.'),
        s('The contract was signed <b>on</b> 15 March.', 'Le contrat a été signé le 15 mars.', 'ON + calendar dates.', 'ON + dates du calendrier.'),
        s('We launch <b>on</b> schedule next Monday.', 'Nous lançons comme prévu lundi prochain.', 'ON schedule = as planned.', 'ON schedule = comme prévu.')]),
      g('IN', { en: 'Months, years, periods', fr: 'Mois, années, périodes' }, { en: 'IN + months, years, quarters', fr: 'IN + mois, années, trimestres' }, [
        s('The annual audit ends <b>in</b> December.', 'L’audit annuel se termine en décembre.', 'IN + months and seasons.', 'IN + mois et saisons.'),
        s('Revenue grew 18% <b>in</b> Q2 2026.', 'Le chiffre d’affaires a progressé de 18 % au T2 2026.', 'IN + quarters and years.', 'IN + trimestres et années.'),
        s('We will review the strategy <b>in</b> six months.', 'Nous réexaminerons la stratégie dans six mois.', 'IN + a length of time = after that time.', 'IN + durée = au bout de ce délai.')]),
      g('BY', { en: 'Deadline', fr: 'Échéance' }, { en: 'BY = no later than', fr: 'BY = au plus tard' }, [
        s('Submit the invoice <b>by</b> close of business.', 'Envoyez la facture avant la fermeture des bureaux.', 'BY = no later than.', 'BY = au plus tard.'),
        s('Please respond <b>by</b> Thursday COB.', 'Merci de répondre d’ici jeudi, fin de journée.', 'COB = close of business.', 'COB = fin de journée de travail.'),
        s('The project must be live <b>by</b> the end of the quarter.', 'Le projet doit être en service d’ici la fin du trimestre.', 'BY the end of… sets a deadline.', 'BY the end of… fixe une échéance.')])
    ],
    place: [
      g('AT', { en: 'Specific spot', fr: 'Lieu précis' }, { en: 'AT + a named point or address', fr: 'AT + un point ou une adresse' }, [
        s('I will meet you <b>at</b> the reception desk.', 'Je vous retrouve à l’accueil.', 'AT + a specific point.', 'AT + un point précis.'),
        s('The team is <b>at</b> capacity this week.', 'L’équipe est à pleine capacité cette semaine.', 'AT capacity = completely full.', 'AT capacity = complet.'),
        s('She is <b>at</b> the head office today.', 'Elle est au siège aujourd’hui.', 'AT + a workplace seen as a point.', 'AT + un lieu de travail vu comme un point.')]),
      g('IN', { en: 'Enclosed area, city, sector', fr: 'Espace, ville, secteur' }, { en: 'IN + cities, countries, sectors', fr: 'IN + villes, pays, secteurs' }, [
        s('Our regional office is <b>in</b> Dakar.', 'Notre bureau régional est à Dakar.', 'IN + cities and countries.', 'IN + villes et pays.'),
        s('The files are <b>in</b> the shared folder.', 'Les fichiers sont dans le dossier partagé.', 'IN = inside something.', 'IN = à l’intérieur de quelque chose.'),
        s('She works <b>in</b> finance.', 'Elle travaille dans la finance.', 'IN + an industry or department.', 'IN + un secteur ou un service.')]),
      g('ON', { en: 'Surface, floor, page', fr: 'Surface, étage, page' }, { en: 'ON + surfaces, floors, pages', fr: 'ON + surfaces, étages, pages' }, [
        s('The agenda is <b>on</b> page 3.', 'L’ordre du jour est en page 3.', 'ON + page numbers.', 'ON + numéros de page.'),
        s('Our team is <b>on</b> the 12th floor.', 'Notre équipe est au 12e étage.', 'ON + floors of a building.', 'ON + étages d’un bâtiment.'),
        s('I will be <b>on</b> site from Monday.', 'Je serai sur site dès lundi.', 'ON site = physically at the location.', 'ON site = physiquement sur place.')])
    ],
    direction: [
      g('TO', { en: 'Destination or recipient', fr: 'Destination ou destinataire' }, { en: 'TO = direction, recipient', fr: 'TO = direction, destinataire' }, [
        s('She travelled <b>to</b> Lagos for the summit.', 'Elle s’est rendue à Lagos pour le sommet.', 'TO = movement toward a place.', 'TO = mouvement vers un lieu.'),
        s('Forward this report <b>to</b> all department heads.', 'Transmettez ce rapport à tous les chefs de département.', 'TO = who receives the action.', 'TO = qui reçoit l’action.'),
        s('We are committed <b>to</b> excellent delivery.', 'Nous nous engageons à une livraison irréprochable.', 'Committed to + noun or -ing.', 'Committed to + nom ou -ing.')]),
      g('INTO', { en: 'Moving inside, turning into', fr: 'Entrer, se transformer' }, { en: 'INTO = inward movement, change', fr: 'INTO = mouvement vers l’intérieur, changement' }, [
        s('We are expanding <b>into</b> the West African market.', 'Nous nous développons sur le marché ouest-africain.', 'INTO = entering a new space or market.', 'INTO = entrer dans un nouvel espace ou marché.'),
        s('The team is looking <b>into</b> the cause of the delay.', 'L’équipe examine la cause du retard.', 'Look into = investigate.', 'Look into = enquêter sur.'),
        s('Turn your ideas <b>into</b> results.', 'Transformez vos idées en résultats.', 'Turn X into Y.', 'Turn X into Y = transformer X en Y.')]),
      g('FROM', { en: 'Origin and starting point', fr: 'Origine et point de départ' }, { en: 'FROM = source, starting point', fr: 'FROM = source, point de départ' }, [
        s('Our method draws <b>from</b> real West African workplaces.', 'Notre méthode s’inspire de situations professionnelles réelles en Afrique de l’Ouest.', 'Draw from = take as a source.', 'Draw from = s’inspirer de.'),
        s('Sales rose <b>from</b> 2 million to 3.5 million XOF.', 'Les ventes sont passées de 2 à 3,5 millions de XOF.', 'FROM… TO… shows a change.', 'FROM… TO… exprime un changement.'),
        s('Feedback <b>from</b> clients was very positive.', 'Les retours des clients étaient très positifs.', 'FROM + source of information.', 'FROM + source d’information.')])
    ],
    business: [
      g('FOR', { en: 'Purpose, duration, employer', fr: 'But, durée, employeur' }, { en: 'FOR = purpose, length of time', fr: 'FOR = but, durée' }, [
        s('She has worked <b>for</b> the bank <b>for</b> seven years.', 'Elle travaille pour la banque depuis sept ans.', 'FOR + employer; FOR + length of time.', 'FOR + employeur ; FOR + durée.'),
        s('We are calling <b>for</b> proposals by the end of the month.', 'Nous lançons un appel à propositions d’ici la fin du mois.', 'Call for = formally request.', 'Call for = demander officiellement.'),
        s('This product accounts <b>for</b> 40% of our savings.', 'Ce produit représente 40 % de nos économies.', 'Account for = represent.', 'Account for = représenter.')]),
      g('WITH', { en: 'Together, by means of', fr: 'Ensemble, au moyen de' }, { en: 'WITH = together, using', fr: 'WITH = avec, au moyen de' }, [
        s('We partner <b>with</b> leading African companies.', 'Nous collaborons avec de grandes entreprises africaines.', 'Partner with = work together with.', 'Partner with = collaborer avec.'),
        s('Please proceed <b>with</b> caution on the new clause.', 'Veuillez avancer avec prudence sur la nouvelle clause.', 'Proceed with = continue using.', 'Proceed with = poursuivre avec.'),
        s('The issue lies <b>with</b> the approval process.', 'Le problème vient du processus d’approbation.', 'Lies with = the cause is.', 'Lies with = la cause se trouve dans.')]),
      g('OF', { en: 'Belonging, parts, fixed phrases', fr: 'Appartenance, parties, expressions figées' }, { en: 'OF = belonging, part of a whole', fr: 'OF = appartenance, partie d’un tout' }, [
        s('The scope <b>of</b> the project covers all branches.', 'Le périmètre du projet couvre toutes les agences.', 'Scope of = the range covered.', 'Scope of = l’étendue couverte.'),
        s('In terms <b>of</b> cost, this option is better.', 'En termes de coût, cette option est préférable.', 'In terms of = regarding.', 'In terms of = en ce qui concerne.'),
        s('A letter <b>of</b> intent was signed yesterday.', 'Une lettre d’intention a été signée hier.', 'Letter of intent: a fixed phrase.', 'Letter of intent : expression figée.')]),
      g('BETWEEN', { en: 'Two parties', fr: 'Deux parties' }, { en: 'BETWEEN = two (AMONG = three or more)', fr: 'BETWEEN = deux (AMONG = trois ou plus)' }, [
        s('The agreement is <b>between</b> our company and the supplier.', 'L’accord est conclu entre notre entreprise et le fournisseur.', 'BETWEEN = two. AMONG = three or more.', 'BETWEEN = deux. AMONG = trois ou plus.'),
        s('There is a gap <b>between</b> target and actual revenue.', 'Il y a un écart entre le chiffre visé et le chiffre réel.', 'Gap between = a key reporting phrase.', 'Gap between = expression clé des rapports.'),
        s('We will split the costs <b>between</b> two departments.', 'Nous répartirons les coûts entre deux services.', 'Split between = divide across two parties.', 'Split between = répartir entre deux parties.')])
    ]
  };

  function q(sentence, answer, options, en, fr) { return { sentence: sentence, answer: answer, options: options, exp: { en: en, fr: fr } }; }
  var QUIZ = [
    q('The meeting is scheduled ___ 3:00 p.m. on Tuesday.', 'at', ['at', 'on', 'in', 'by'], 'Use AT for clock times.', 'Utilisez AT pour une heure précise.'),
    q('Please submit your report ___ Friday, close of business.', 'by', ['on', 'at', 'by', 'until'], 'BY = no later than. It sets a deadline.', 'BY = au plus tard. Il fixe une échéance.'),
    q('She has worked ___ this project ___ six months.', 'on … for', ['on … for', 'in … since', 'at … by', 'with … in'], 'ON a project, FOR a length of time.', 'ON un projet, FOR une durée.'),
    q('Our office is located ___ the 5th floor.', 'on', ['in', 'at', 'on', 'by'], 'ON + floor number.', 'ON + numéro d’étage.'),
    q('We are expanding ___ the East African market.', 'into', ['to', 'in', 'into', 'at'], 'INTO = entering a new market.', 'INTO = entrer sur un nouveau marché.'),
    q('The project will finish ___ December.', 'in', ['at', 'on', 'in', 'by'], 'IN + months, years, quarters.', 'IN + mois, années, trimestres.'),
    q('The agreement was signed ___ 12 January 2026.', 'on', ['in', 'on', 'at', 'by'], 'ON + a specific date.', 'ON + une date précise.'),
    q('This decision lies ___ the board of directors.', 'with', ['for', 'with', 'to', 'at'], 'Lies with = the responsibility belongs to.', 'Lies with = la responsabilité revient à.'),
    q('Sales rose ___ 12%, ___ 5 million to 5.6 million XOF.', 'by … from', ['by … from', 'of … in', 'to … at', 'at … by'], 'Rose BY an amount; FROM a starting point.', 'Rose BY un montant ; FROM un point de départ.'),
    q('Please refer ___ the attached document ___ details.', 'to … for', ['to … for', 'at … in', 'on … of', 'in … with'], 'Refer TO a document, FOR details.', 'Refer TO un document, FOR les détails.')
  ];

  var KORO = [
    { who: 'bot', en: 'Hello! I am Koro, your Windsor Business English tutor. Which sector do you work in?', fr: 'Bonjour ! Je suis Koro, votre tuteur Windsor en Business English. Dans quel secteur travaillez-vous ?' },
    { who: 'me', en: 'Banking. Help me write a follow-up email.', fr: 'La banque. Aidez-moi à rédiger un e-mail de relance.' },
    { who: 'bot', en: 'Of course. Try: “Further to our meeting on Monday, I am writing to confirm the key points we discussed.” Shall we continue?', fr: 'Bien sûr. Essayez : « Further to our meeting on Monday, I am writing to confirm the key points we discussed. » On continue ?' },
    { who: 'me', en: 'Yes, add a polite deadline.', fr: 'Oui, ajoutez une échéance polie.' },
    { who: 'bot', en: 'Add: “Could you please confirm by Thursday COB?” Note the preposition: by means no later than.', fr: 'Ajoutez : « Could you please confirm by Thursday COB? » Notez la préposition : by signifie au plus tard.' }
  ];

  function p(qEn, o, a, nEn, nFr) { return { q: qEn, o: o, a: a, n: { en: nEn, fr: nFr } }; }
  var PORTAL = [
    p('We will meet ___ Monday morning.', ['in', 'on', 'at'], 1, 'Use “on” with days: on Monday, on 5 May.', 'On utilise « on » avec les jours : on Monday, on 5 May.'),
    p('Please find the report ___ this email.', ['attached to', 'attached in', 'attached on'], 0, '“Attached to this email” is the standard business phrase.', '« Attached to this email » est la formule professionnelle standard.'),
    p('I am writing ___ your invoice dated 3 March.', ['regarding', 'regards of', 'about of'], 0, '“Regarding” is formal and concise. Never “regards of”.', '« Regarding » est formel et concis. Jamais « regards of ».'),
    p('The meeting starts ___ 9 a.m.', ['on', 'at', 'in'], 1, 'Use “at” with clock times.', 'On utilise « at » avec les heures.'),
    p('Which closing is the most professional?', ['Bye bye!', 'Kind regards,', 'See u'], 1, '“Kind regards” works in almost every professional email.', '« Kind regards » convient à presque tous les e-mails professionnels.'),
    p('We are looking forward ___ working with you.', ['to', 'for', 'at'], 0, '“Look forward to” is followed by -ing: looking forward to working.', '« Look forward to » est suivi de -ing : looking forward to working.')
  ];

  /* Unverified drafts. Set verified:true only for real, permitted testimonials. */
  var TESTIMONIALS = [
    { verified: false, en: 'Our team now closes international deals with far more confidence.', fr: 'Notre équipe conclut désormais ses accords internationaux avec bien plus d’assurance.', name: 'Name Surname', role: { en: 'Director, Company', fr: 'Directeur, Entreprise' } }
  ];


  function ph(en, fr, uEn, uFr) { return { en: en, fr: fr, use: { en: uEn, fr: uFr } }; }
  var SECTORS = [
    { id: 'finance', icon: 'fa-chart-pie', name: { en: 'Finance', fr: 'Finance' }, phrases: [
      ph('We are forecasting a 6% variance against budget.', 'Nous prévoyons un écart de 6 % par rapport au budget.', 'Monthly reporting', 'Reporting mensuel'),
      ph('Could you walk me through the assumptions?', 'Pouvez-vous me détailler les hypothèses ?', 'Reviewing a model', 'Revue d’un modèle'),
      ph('Let us close the books by the end of next week.', 'Clôturons les comptes d’ici la fin de la semaine prochaine.', 'Period-end planning', 'Planification de clôture')] },
    { id: 'banking', icon: 'fa-building-columns', name: { en: 'Banking', fr: 'Banque' }, phrases: [
      ph('The facility is subject to final credit approval.', 'La facilité est soumise à l’approbation finale du crédit.', 'Client proposals', 'Propositions clients'),
      ph('Could you confirm the beneficiary’s details?', 'Pouvez-vous confirmer les coordonnées du bénéficiaire ?', 'Payment checks', 'Contrôle des paiements'),
      ph('I would like to flag a discrepancy in the statement.', 'Je souhaite signaler une divergence dans le relevé.', 'Compliance and audit', 'Conformité et audit')] },
    { id: 'energy', icon: 'fa-oil-well', name: { en: 'Oil & gas', fr: 'Pétrole et gaz' }, phrases: [
      ph('Safety first: let us pause the operation and reassess.', 'La sécurité d’abord : suspendons l’opération et réévaluons.', 'Site briefings', 'Briefings de site'),
      ph('The supplier has confirmed delivery of the equipment on site.', 'Le fournisseur a confirmé la livraison du matériel sur site.', 'Procurement updates', 'Suivi des achats'),
      ph('We are two weeks behind schedule on this phase.', 'Nous avons deux semaines de retard sur cette phase.', 'Project meetings', 'Réunions de projet')] },
    { id: 'legal', icon: 'fa-scale-balanced', name: { en: 'Legal', fr: 'Droit' }, phrases: [
      ph('The parties hereby agree to the following terms.', 'Les parties conviennent par les présentes des conditions suivantes.', 'Drafting contracts', 'Rédaction de contrats'),
      ph('We reserve the right to terminate with thirty days’ notice.', 'Nous nous réservons le droit de résilier moyennant un préavis de trente jours.', 'Negotiating clauses', 'Négociation de clauses'),
      ph('Could you review the draft before we circulate it?', 'Pouvez-vous relire le projet avant que nous le diffusions ?', 'Internal review', 'Relecture interne')] },
    { id: 'health', icon: 'fa-stethoscope', name: { en: 'Healthcare', fr: 'Santé' }, phrases: [
      ph('The patient presented with a persistent cough.', 'Le patient s’est présenté avec une toux persistante.', 'Case notes', 'Notes de cas'),
      ph('Please take this medication twice a day with food.', 'Prenez ce médicament deux fois par jour pendant les repas.', 'Patient instructions', 'Consignes au patient'),
      ph('We need to restock consumables by Friday.', 'Nous devons réapprovisionner les consommables d’ici vendredi.', 'Supply planning', 'Planification des stocks')] },
    { id: 'logistics', icon: 'fa-ship', name: { en: 'Logistics', fr: 'Logistique' }, phrases: [
      ph('The container will arrive at the port on Tuesday.', 'Le conteneur arrivera au port mardi.', 'Shipping updates', 'Suivi d’expédition'),
      ph('Could you confirm the delivery window?', 'Pouvez-vous confirmer la plage de livraison ?', 'Client coordination', 'Coordination client'),
      ph('There is a customs delay, and we will keep you updated.', 'Il y a un retard en douane, nous vous tiendrons informé.', 'Managing delays', 'Gestion des retards')] }
  ];

  function lq(q, o, a, en, fr) { return { q: q, o: o, a: a, n: { en: en, fr: fr } }; }
  var LEVEL = {
    qs: [
      lq('She ___ the weekly report every Friday.', ['send', 'sends', 'sending', 'is send'], 1, 'Third person singular in the present simple takes -s.', 'La troisième personne du singulier au présent simple prend -s.'),
      lq('The meeting starts ___ 9 a.m. ___ Monday.', ['in / on', 'at / on', 'on / at', 'at / in'], 1, '“At” for clock times, “on” for days.', '« At » pour les heures, « on » pour les jours.'),
      lq('Our office ___ open from 8 a.m. to 5 p.m.', ['is', 'are', 'be', 'does'], 0, 'Singular subject, so “is”.', 'Sujet singulier, donc « is ».'),
      lq('Could you send me ___ information about the contract?', ['a', 'an', 'some', 'many'], 2, '“Information” is uncountable, so use “some”.', '« Information » est indénombrable, on utilise donc « some ».'),
      lq('Please ___ me know if you have any questions.', ['let', 'make', 'tell', 'say'], 0, '“Let me know” is the standard polite phrase.', '« Let me know » est la formule polie standard.'),
      lq('We ___ the proposal to the client yesterday.', ['send', 'sent', 'have sent', 'were send'], 1, 'A finished action at a past time: past simple.', 'Une action terminée à un moment passé : prétérit.'),
      lq('I ___ in finance for five years.', ['work', 'am working', 'have worked', 'worked'], 2, 'For a period up to now, use the present perfect.', 'Pour une durée qui continue jusqu’à maintenant, on utilise le present perfect.'),
      lq('Our sales are higher than ___ year.', ['last', 'the last', 'lastly', 'at last'], 0, '“Last year” needs no article.', '« Last year » s’emploie sans article.'),
      lq('I am responsible ___ the marketing team.', ['of', 'for', 'to', 'at'], 1, '“Responsible for” is the correct collocation.', '« Responsible for » est la collocation correcte.'),
      lq('The shipment was delayed ___ bad weather.', ['because', 'because of', 'although', 'so'], 1, '“Because of” is followed by a noun.', '« Because of » est suivi d’un nom.'),
      lq('By the time the auditors arrive, we ___ the accounts.', ['finish', 'will finish', 'will have finished', 'are finishing'], 2, 'Future perfect for an action completed before a future point.', 'Futur antérieur pour une action achevée avant un moment futur.'),
      lq('I look forward ___ from you.', ['to hear', 'to hearing', 'hearing', 'for hearing'], 1, '“Look forward to” takes the -ing form.', '« Look forward to » est suivi de la forme en -ing.'),
      lq('The manager suggested ___ the deadline.', ['to extend', 'extending', 'extend', 'for extending'], 1, '“Suggest” is followed by the -ing form.', '« Suggest » est suivi de la forme en -ing.'),
      lq('Please find the document ___ to this email.', ['attached', 'attaching', 'attach', 'attachment'], 0, '“Attached” is the standard participle in this phrase.', '« Attached » est le participe habituel dans cette formule.'),
      lq('If we had signed earlier, we ___ the discount.', ['would get', 'will get', 'would have got', 'had got'], 2, 'Third conditional: had + past participle, would have + past participle.', 'Troisième conditionnel : had + participe passé, would have + participe passé.'),
      lq('We need to ___ the budget to cover the new hires.', ['relocate', 'reallocate', 'reallow', 'realise'], 1, '“Reallocate” means to distribute resources differently.', '« Reallocate » signifie répartir autrement des ressources.'),
      lq('We cannot sign the deal ___ the terms are revised.', ['unless', 'despite', 'whereas', 'otherwise'], 0, '“Unless” means “if not”.', '« Unless » signifie « si… ne… pas ».'),
      lq('The CEO insisted that the report ___ submitted by noon.', ['is', 'was', 'be', 'will be'], 2, 'After “insist that”, the subjunctive uses the base form: be.', 'Après « insist that », le subjonctif utilise la forme de base : be.'),
      lq('Had we known about the delay, we ___ another supplier.', ['would choose', 'will have chosen', 'would have chosen', 'had chosen'], 2, 'Inverted third conditional: Had we known, we would have chosen.', 'Troisième conditionnel inversé : Had we known, we would have chosen.'),
      lq('Not only ___ the deadline, they also exceeded the budget.', ['they missed', 'did they miss', 'they did miss', 'missed they'], 1, 'After “Not only” at the start, the auxiliary comes first: did they miss.', 'Après « Not only » en début de phrase, l’auxiliaire passe en premier : did they miss.')
    ],
    bands: [
      { min: 0, lvl: 'A2', name: { en: 'Elementary', fr: 'Élémentaire' }, msg: { en: 'You have the basics. A guided foundation group will build confidence with everyday workplace English fast.', fr: 'Vous avez les bases. Un groupe de fondation guidé renforcera vite votre assurance avec l’anglais courant du travail.' }, prog: { en: 'Windsor Corporate Programme (foundation group)', fr: 'Programme Windsor Corporate (groupe fondation)' } },
      { min: 8, lvl: 'B1', name: { en: 'Intermediate', fr: 'Intermédiaire' }, msg: { en: 'You can handle routine tasks. The next step is precision and polish in emails and meetings.', fr: 'Vous gérez les tâches courantes. L’étape suivante est la précision et le style dans les e-mails et les réunions.' }, prog: { en: 'Windsor Corporate Programme or a Windsor Workshop', fr: 'Programme Windsor Corporate ou un atelier Windsor' } },
      { min: 13, lvl: 'B2', name: { en: 'Upper intermediate', fr: 'Intermédiaire avancé' }, msg: { en: 'You communicate well. Focused coaching on negotiation and presentations will make you persuasive.', fr: 'Vous communiquez bien. Un coaching ciblé en négociation et en présentation vous rendra convaincant.' }, prog: { en: 'Executive English Coaching or International certifications', fr: 'Coaching d’anglais pour dirigeants ou certifications internationales' } },
      { min: 18, lvl: 'C1', name: { en: 'Advanced', fr: 'Avancé' }, msg: { en: 'Your English is strong. Fine-tune nuance, tone and leadership communication.', fr: 'Votre anglais est solide. Affinez la nuance, le ton et la communication de dirigeant.' }, prog: { en: 'Executive English Coaching', fr: 'Coaching d’anglais pour dirigeants' } }
    ]
  };

  /* Real figures only. Leave a value at 0 and its tile stays hidden. Fill in once you can stand behind the number. */
  /* Social profiles. Paste each full profile address into `url` to switch that icon on.
     While `url` is empty the icon shows as "coming soon" and is not clickable. */
  var SOCIAL = [
    { id: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin-in', url: '' },
    { id: 'facebook', name: 'Facebook', icon: 'fab fa-facebook-f', url: '' },
    { id: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', url: '' },
    { id: 'x', name: 'X', icon: 'fab fa-x-twitter', url: '' },
    { id: 'youtube', name: 'YouTube', icon: 'fab fa-youtube', url: '' },
    { id: 'tiktok', name: 'TikTok', icon: 'fab fa-tiktok', url: '' },
    { id: 'wachannel', name: 'WhatsApp Channel', icon: 'fab fa-whatsapp', url: '' }
  ];

  var PROOF = { learners: 0, companies: 0, hours: 0, sectors: 0 };

  return { SOCIAL: SOCIAL, PROOF: PROOF, SECTORS: SECTORS, LEVEL: LEVEL, PREP: PREP, QUIZ: QUIZ, KORO: KORO, PORTAL: PORTAL, TESTIMONIALS: TESTIMONIALS };
})();
