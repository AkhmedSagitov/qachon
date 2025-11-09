/**
 * Марказлаштирилган контент бошқаруви
 * Илова учун барча матнли контент
 */

export const content = {
  // Сайт маълумоти
  site: {
    title: "QACHON",
    description: "Тадбирлар учун ресторанлар ҳақида ахборот сайти",
    copyright: (year: number) => `© ${year} Тадбирлар`,
  },

  // Навигация
  nav: {
    home: "Бош саҳифа",
    about: "Биз ҳақимизда",
    dashboard: "Бошқарув панели",
    myRestaurants: "Менинг ресторанларим",
    back: "← Орқага",
    backToList: "← Рўйхатга қайтиш",
    openMenu: "Менюни очиш",
    closeMenu: "Менюни ёпиш",
  },

  // Аутентификация
  auth: {
    login: "Кириш",
    register: "Рўйхатдан ўтиш",
    logout: "Чиқиш",
    loginShort: "Кириш",
    loading: "Юкланмоқда...",
    greeting: (email: string) => `Салом, ${email}!`,
    signIn: "Кириш",
    createAccount: "Аккаунт яратиш",
    authorization: "Авторизация",
    emailLabel: "Email *",
    passwordLabel: "Парол *",
    confirmPasswordLabel: "Паролни тасдиқлаш *",
    nameLabel: "Исм (мажбурий эмас)",
    phoneLabel: "Телефон (мажбурий эмас)",
    roleLabel: "Роль",

    // Аутентификация хатолари
    authRequired: "Авторизация талаб қилинади",
    noAccess: "Рухсат йўқ",
    invalidCredentials: "Нотўғри email ёки парол",
    signInError: "Кириш вақтида хатолик юз берди",
    loginError: "Кириш хатолиги",
    registrationSuccess: "Рўйхатдан ўтиш муваффақиятли бўлди! Хуш келибсиз!",
    registrationError: "Рўйхатдан ўтишда хатолик",
    userExists: "Бу email билан фойдаланувчи аллақачон мавжуд",

    // Текшириш
    emailRequired: "Email мажбурий",
    emailInvalid: "Нотўғри email формати",
    passwordRequired: "Парол мажбурий",
    passwordMinLength: "Парол камида 6 та белгидан иборат бўлиши керак",
    confirmPasswordRequired: "Паролни тасдиқлаш мажбурий",
    passwordsDoNotMatch: "Пароллар мос келмади",
  },

  // Умумий амаллар
  actions: {
    create: "Яратиш",
    edit: "Таҳрирлаш",
    delete: "Ўчириш",
    save: "Сақлаш",
    cancel: "Бекор қилиш",
    submit: "Юбориш",
    search: "Қидириш",
    filter: "Филтр",
    close: "Ёпиш",
    confirm: "Тасдиқлаш",
    view: "Кўриш",
    viewDetails: "Кўриб чиқиш",
    manage: "Бошқариш",
    download: "Юклаб олиш",
    upload: "Юклаш",
    uploadFile: "📁 Юклаш",
    addImage: "+ Расм қўшиш",
    remove: "Ўчириш",
    saveChanges: "Ўзгаришларни сақлаш",
  },

  // Ресторан
  restaurant: {
    title: "Ресторанлар",
    titlePlural: "Тадбирлар учун ресторанлар",
    create: "Ресторан яратиш",
    createButton: "✨ Ресторан қўшиш",
    addRestaurant: "Ресторан қўшиш",
    addFirstRestaurant: "Биринчи ресторанни қўшиш",
    edit: "Ресторанни таҳрирлаш",
    editButton: "⚙️ Таҳрирлаш",
    delete: "Ресторанни ўчириш",
    myRestaurants: "Менинг ресторанларим",
    allRestaurants: "Барча ресторанлар",

    // Майдонлар
    name: "Номи",
    nameLabel: "Ресторан номи *",
    description: "Тавсиф",
    descriptionLabel: "Тавсиф",
    address: "Манзил",
    addressLabel: "Манзил *",
    city: "Шаҳар",
    cityLabel: "Шаҳар *",
    region: "Вилоят",
    regionLabel: "Вилоят *",
    phone: "Телефон",
    phoneLabel: "Телефон",
    email: "Email",
    emailLabel: "Email",
    website: "Веб-сайт",
    websiteLabel: "Веб-сайт",
    capacity: "Сиғими",
    capacityLabel: "Сиғими (меҳмонлар сони) *",
    capacityDisplay: (num: number) => `${num} та меҳмонгача`,
    price: "Соатига нарх",
    priceLabel: "Соатига нарх (сўм) *",
    priceFrom: (price: string) => `${price} сўм/соат`,
    pricePerHour: "Соатига нарх",
    currency: "сўм",
    perHour: "соат",
    latitude: "Кенглик",
    longitude: "Узунлик",
    images: "Расмлар",
    imagesLabel: "Расмлар (мажбурий эмас)",
    imageLabel: (index: number, isPrimary: boolean) =>
      `Расм ${index + 1}${isPrimary ? ' (асосий)' : ''}`,
    imageInstructions: "Қурилмадан расмларни юкланг ёки URL нусхасини киритинг. Биринчи расм асосий расм сифатида фойдаланилади.",
    imageAlt: (name: string, index: number) => `${name} - расм ${index + 1}`,

    // Қидириш
    searchPlaceholder: "Номини киритинг...",
    allRegions: "Барча вилоятлар",
    searchButton: "🔍 Қидириш",
    searchResults: (query: string) => `Қидирув натижалари: "${query}"`,
    searchResultsRegion: "Танланган вилоятдаги ресторанлар",
    resultsCount: (count: number) => `Топилди: ${count}`,

    // Ҳолат
    active: "Фаол",
    inactive: "Фаол эмас",
    slotsCount: (count: number) => `Слотлар: ${count}`,

    // Хабарлар
    noRestaurants: "Ҳозирча ресторанлар йўқ",
    noRestaurantsOwner: "Сизда ҳозирча ресторанлар йўқ",
    noResults: "Ресторанлар топилмади",
    notFound: "Ресторан топилмади",
    deleteConfirm: (name: string) => `${name} ресторанини ўчиришга ишончингиз комилми?`,
    deleteWarning: "Бу амал қайтарилмайди. Барча боғланган маълумотлар (слотлар, броньлар) ўчирилади.",
    createSuccess: "Ресторан муваффақиятли яратилди",
    updateSuccess: "Ресторан муваффақиятли янгиланди",
    deleteSuccess: "Ресторан муваффақиятли ўчирилди",
    createError: "Ресторан яратишда хатолик юз берди",
    updateError: "Ресторанни янгилашда хатолик",
    deleteError: "Ресторанни ўчиришда хатолик",
    loadError: "Ресторанларни юклашда хатолик",
    loadErrorSingle: "Ресторанни юклашда хатолик",
    loadErrorOwner: "Сизнинг ресторанларингизни юклашда хатолик",
    loadErrorRegions: "Вилоятларни юклашда хатолик",
    imageUploadError: "Расмни юклашда хатолик",

    // Рухсатлар
    ownersOnly: "Фақат эгалар ресторанларни кўра олади",
    ownersOnlyCreate: "Фақат эгалар ресторан яратиши мумкин",
    ownersOnlyEdit: "Фақат эгалар ресторанни таҳрирлаши мумкин",
    ownersOnlyDelete: "Фақат эгалар ресторанни ўчириши мумкин",
    noEditPermission: "Таҳрирлаш учун рухсат йўқ",
    noDeletePermission: "Ўчириш учун рухсат йўқ",
  },

  // Тақвим
  calendar: {
    selectDate: "Санани танланг",
    selectDatePrompt: "Мавжуд слотларни кўриш учун тақвимда санани босинг",
    noSlotsForDate: "Бу санада мавжуд слотлар йўқ",
    dayNames: ["Душ", "Се", "Чор", "Пай", "Жум", "Шан", "Якш"],
    timeIcon: "⏰",
    guestsIcon: "👥",
    slotCount: (count: number) => `${count}`,
  },

  // Слотлар/Тадбирлар
  slot: {
    title: "Слотлар",
    availableSlots: "Мавжуд слотлар",
    createdSlots: "Яратилган слотлар",
    manageSlots: "Слотларни бошқариш",
    manageSlotsButton: "📅 Слотларни бошқариш",
    create: "Слот яратиш",
    createButton: "Слот яратиш",
    createMultiple: "Бир нечта слот яратиш",
    createSingle: "Бир слот яратиш",
    singleSlotTab: "Бир слот",
    multipleSlotTab: "Бир нечта слот",
    bulkDescription: "Белгиланган даврдаги ҳар бир кун учун битта слот яратилади",
    edit: "Слотни таҳрирлаш",
    delete: "Слотни ўчириш",

    // Майдонлар
    date: "Сана",
    dateLabel: "Сана *",
    startDate: "Бошланиш санаси",
    startDateLabel: "Бошланиш санаси *",
    endDate: "Тугаш санаси",
    endDateLabel: "Тугаш санаси *",
    startTime: "Бошланиш вақти",
    startTimeLabel: "Бошланиш вақти *",
    endTime: "Тугаш вақти",
    endTimeLabel: "Тугаш вақти *",
    capacity: "Сиғими",
    capacityLabel: "Сиғими *",
    capacityDisplay: (num: number) => `👥 ${num} та меҳмонгача`,
    price: "Нарх",
    priceLabel: "Нарх (сўм) *",
    currency: "сўм",
    isAvailable: "Мавжуд",
    available: "Мавжуд",
    unavailable: "Мавжуд эмас",
    booked: "Броньланган",
    eventType: "Тадбир тури",
    eventTypeLabel: "Тадбир тури",

    // Тадбир турлари
    eventTypes: {
      wedding: "Тўй",
      birthday: "Туғилган кун",
      corporate: "Корпоратив",
      anniversary: "Юбилей",
      other: "Бошқа",
    },

    // Хабарлар
    noSlots: "Ҳозирча слотлар йўқ. Юқоридаги форма ёрдамида биринчи слотни яратинг.",
    slotsDescription: "Мавжуд саналар ва вақтларни кўриб чиқинг. Бронь қилиш учун юқоридаги контактлар орқали ресторан билан боғланинг.",
    deleteConfirm: "Бу слотни ўчиришга ишончингиз комилми?",
    createSuccess: "Слот муваффақиятли яратилди!",
    createSuccessMultiple: (count: number) => `${count} та слот муваффақиятли яратилди!`,
    updateSuccess: "Слот муваффақиятли янгиланди",
    deleteSuccess: "Слот муваффақиятли ўчирилди",
    createError: "Слот яратишда хатолик",
    createErrorMultiple: "Слотларни яратишда хатолик",
    updateError: "Слотни янгилашда хатолик",
    deleteError: "Слотни ўчиришда хатолик",
    loadError: "Слотларни юклашда хатолик",

    // Рухсатлар
    ownersOnly: "Фақат эгалар слотларни кўра олади",
    ownersOnlyCreate: "Фақат эгалар слот яратиши мумкин",
    ownersOnlyEdit: "Фақат эгалар слотни таҳрирлаши мумкин",
    ownersOnlyDelete: "Фақат эгалар слотни ўчириши мумкин",
    noViewPermission: "Кўриш учун рухсат йўқ",
    noCreatePermission: "Слот яратиш учун рухсат йўқ",
    noEditPermission: "Таҳрирлаш учун рухсат йўқ",
    noDeletePermission: "Ўчириш учун рухсат йўқ",
  },

  // Текшириш хабарлари
  validation: {
    required: "мажбурий",
    requiredField: "Мажбурий майдон",
    validationError: "Текшириш хатолиги",

    // Email
    emailRequired: "Email мажбурий",
    emailInvalid: "Нотўғри email формати",
    emailFormat: "Нотўғри email",

    // Парол
    passwordRequired: "Парол мажбурий",
    passwordMin: "Парол камида 6 та белгидан иборат бўлиши керак",
    passwordMinLength: (min: number) => `Парол камида ${min} та белгидан иборат бўлиши керак`,
    passwordMax: "Парол максимум 32 та белгидан иборат бўлиши керак",
    confirmPasswordRequired: "Паролни тасдиқлаш мажбурий",
    passwordMismatch: "Пароллар мос келмади",

    // Ном
    nameRequired: "Ном мажбурий",
    nameMin: (min: number) => `Ном камида ${min} та белгидан иборат бўлиши керак`,
    nameMax: (max: number) => `Ном ${max} та белгидан ошмаслиги керак`,
    nameMinGeneric: "Исм камида 2 та белгидан иборат бўлиши керак",
    nameMaxGeneric: "Исм максимум 100 та белгидан иборат бўлиши керак",

    // Матн майдонлари
    descriptionMax: "Тавсиф 2000 та белгидан ошмаслиги керак",
    addressRequired: "Манзил мажбурий",
    addressMin: "Манзил камида 5 та белгидан иборат бўлиши керак",
    cityRequired: "Шаҳар мажбурий",
    cityMin: "Шаҳар камида 2 та белгидан иборат бўлиши керак",

    // Телефон
    phoneInvalid: "Нотўғри телефон формати",
    phoneFormat: "Нотўғри телефон формати",

    // URL
    urlInvalid: "Нотўғри URL формати",

    // Вилоят
    regionRequired: "Вилоят мажбурий",
    regionInvalid: "Нотўғри вилоят формати",

    // Сиғим
    capacityRequired: "Сиғим мажбурий",
    capacityInteger: "Сиғим бутун сон бўлиши керак",
    capacityMin: (min: number) => `Минимал сиғим ${min} киши`,
    capacityMinSingle: "Минимал сиғим 1 киши",
    capacityMax: (max: number) => `Максимал сиғим ${max} киши`,

    // Нарх
    priceRequired: "Нарх мажбурий",
    priceNonNegative: "Нарх манфий бўлиши мумкин эмас",
    priceMax: "Нарх жуда катта",

    // Координаталар
    latitudeRange: "Кенглик -90 дан 90 гача бўлиши керак",
    longitudeRange: "Узунлик -180 дан 180 гача бўлиши керак",

    // Сана/Вақт
    dateRequired: "Сана мажбурий",
    startDateRequired: "Бошланиш санаси мажбурий",
    endDateRequired: "Тугаш санаси мажбурий",
    timeRequired: "Вақт мажбурий",
    startTimeRequired: "Бошланиш вақти мажбурий",
    endTimeRequired: "Тугаш вақти мажбурий",
    timeFormat: "Нотўғри вақт формати (HH:MM)",
    dateRangeInvalid: "Тугаш санаси бошланиш санасидан кейин бўлиши керак",
    timeSlotRequired: "Камида битта вақт слоти кўрсатилиши керак",

    // Бошқа
    restaurantRequired: "Ресторан мажбурий",
    selectRole: "Аккаунт турини танланг",
  },

  // Форма элементлари
  form: {
    selectOption: "Вариантни танланг",
    selectRegion: "Вилоятни танлаш",
    uploadImage: "Расм юклаш",
    dragDropImage: "Расмни судраб ташланг ёки танлаш учун босинг",
    imagePreview: (index: number) => `Кўриниш ${index + 1}`,
  },

  // Юклаш/Файллар
  upload: {
    fileNotFound: "Файл топилмади",
    unsupportedFormat: "Қўлланилмайдиган файл формати. Рухсат берилган: JPG, PNG, WebP, GIF",
    fileTooLarge: "Файл жуда катта. Максимал ҳажм: 5MB",
    uploadError: "Файлни юклашда хатолик",
  },

  // Ҳолат хабарлари
  status: {
    success: "Муваффақиятли!",
    error: "Хатолик!",
    warning: "Диққат!",
    info: "Маълумот",
    loading: "Юкланмоқда...",
    saving: "Сақланмоқда...",
    deleting: "Ўчирилмоқда...",
    processing: "Ишланмоқда...",
  },

  // Умумий хатолар
  errors: {
    generic: "Хатолик юз берди. Кейинроқ уриниб кўринг.",
    notFound: "Топилмади",
    pageNotFound: "Саҳифа топилмади",
    unauthorized: "Рухсат йўқ",
    authRequired: "Авторизация талаб қилинади",
    forbidden: "Тақиқланган",
    serverError: "Сервер хатолиги",
    networkError: "Тармоқ хатолиги",
    validationError: "Текшириш хатолиги",
  },

  // Саҳифалаш
  pagination: {
    previous: "Олдинги",
    next: "Кейинги",
    first: "Биринчи",
    last: "Охирги",
    page: "Саҳифа",
    of: "дан",
    showing: "Кўрсатилмоқда",
    results: "натижалар",
  },

  // Эга/Бошқарув панели
  owner: {
    dashboard: "Эга бошқарув панели",
    dashboardShort: "Бошқарув панели",
    statistics: "Статистика",
    totalRestaurants: "Жами ресторанлар",
    activeSlots: "Фаол слотлар",
    totalSlots: "Жами слотлар",
    totalBookings: "Жами броньлар",
    revenue: "Даромад",
    manageRestaurants: "Ресторанларни бошқариш",
    manageSlots: "Слотларни бошқариш",
    myRestaurants: "Менинг ресторанларим",
    addRestaurant: "+ Ресторан қўшиш",
    quickActions: "Тез амаллар",
  },

  // Сана/Вақт
  dateTime: {
    today: "Бугун",
    yesterday: "Кеча",
    tomorrow: "Эртага",
    week: "Ҳафта",
    month: "Ой",
    year: "Йил",
    selectDate: "Санани танланг",
    selectTime: "Вақтни танланг",
  },

  // Роллар
  roles: {
    owner: "Эга",
    customer: "Мижоз",
    admin: "Администратор",
  },

  // Биз ҳақимизда саҳифаси
  about: {
    title: "Биз ҳақимизда",
    description: "Платформа ҳақида маълумот",

    // Асосий тавсиф
    mainDescription: "Биз тадбирлар учун ресторанларни топишни осонлаштирадиган замонавий платформамиз. Тўй, туғилган кун, корпоратив ёки бошқа муҳим тадбирингиз учун мукаммал жойни бир неча дақиқада топинг.",

    // Имкониятлар
    featuresTitle: "Платформа имкониятлари",
    features: {
      search: {
        title: "Осон қидирув",
        description: "Вилоят, шаҳар ва санага кўра ресторанларни тез топинг"
      },
      availability: {
        title: "Мавжудликни кўриш",
        description: "Реал вақтда ресторанларнинг бўш саналари ва вақтларини кўринг"
      },
      details: {
        title: "Батафсил маълумот",
        description: "Ресторан ҳақида тўлиқ маълумот, расмлар, нарх ва сиғими"
      },
      contact: {
        title: "Бевосита алоқа",
        description: "Ресторан билан бевосита боғланиш ва барча саволларингизни беришинг"
      }
    },

    // Ресторан эгалари учун
    forOwnersTitle: "Ресторан эгалари учун",
    forOwners: {
      manage: {
        title: "Осон бошқарув",
        description: "Ресторанларингизни ва слотларингизни бир жойдан бошқаринг"
      },
      visibility: {
        title: "Кўринарлик",
        description: "Ресторанингизни минглаб одамларга кўрсатинг"
      },
      schedule: {
        title: "Мослашувчан жадвал",
        description: "Бўш кунларингизни ва вақтларингизни ўзингиз белгиланг"
      },
      free: {
        title: "Бепул фойдаланиш",
        description: "Ресторанингизни қўшиш ва бошқариш тўлиқ бепул"
      }
    },

    // Мижозлар учун
    forClientsTitle: "Мижозлар учун",
    forClients: {
      simple: {
        title: "Соддалик",
        description: "Жуда оддий ва тушунарли интерфейс"
      },
      variety: {
        title: "Кенг танлов",
        description: "Турли хил ресторанлар ва нарх категориялари"
      },
      reliable: {
        title: "Ишончлилик",
        description: "Фақат текширилган ва тасдиқланган ресторанлар"
      },
      convenient: {
        title: "Қулайлик",
        description: "Исталган вақтда исталган жойдан қидиринг"
      }
    },

    // Қўшимча
    howItWorks: "Қандай ишлайди",
    getStarted: "Бошлаш",
    joinUs: "Бизга қўшилинг",
    questions: "Саволларингиз борми? Биз билан боғланинг!"
  },

  // Бош саҳифа
  home: {
    welcome: "Хуш келибсиз",
    title: "Тадбирлар учун ресторанлар",
    description: "Тўйингиз, юбилейингиз ёки корпоратив тадбирингиз учун мукаммал жойни топинг. Мавжуд саналарни кўринг ва ресторан билан бевосита боғланинг.",
    searchPlaceholder: "Ресторанларни қидириш...",
    featured: "Танланган ресторанлар",
    popular: "Машҳур",
    newest: "Янгилар",
    ctaTitle: "Ресторан эгасимисиз?",
    ctaDescription: "Ресторанингизни жойлаштиринг ва тадбирлар учун мавжудлигини кўрсатинг",
    ctaButton: "✨ Ресторан қўшиш",
  },

  // Контакт тегларлари
  contact: {
    address: "Манзил:",
    phone: "Телефон:",
    email: "Email:",
    website: "Сайт:",
  },
} as const;

// Тип-хавфсиз контент олувчи
export type ContentKey = keyof typeof content;
export type Content = typeof content;

// Ички контентни олиш учун ёрдамчи функция
export function getText(path: string): string {
  const keys = path.split('.');
  let value: any = content;

  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`Контент калити топилмади: ${path}`);
      return path;
    }
  }

  return typeof value === 'string' ? value : path;
}
