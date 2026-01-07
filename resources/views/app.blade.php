<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" translate="no">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Título dinámico -->
    <title inertia>{{ config('app.name', 'Maro Uniformes') }}</title>

    <!-- Favicon -->
    <link rel="icon" href="https://res.cloudinary.com/dnbklbswg/image/upload/v1767750866/pragatilogo_cw8xso.jpg">

    <!-- Fuente principal -->
    <link href="https://res.cloudinary.com/dnbklbswg/image/upload/v1767750866/pragatilogo_cw8xso.jpg" rel="stylesheet">

    <!-- Meta Open Graph para redes sociales -->
    <meta property="og:title" content="Maro Uniformes" />
    <meta property="og:description" content="Uniformes de calidad en Concepción, Chile" />
    <meta property="og:image" content="https://res.cloudinary.com/dnbklbswg/image/upload/v1767750866/pragatilogo_cw8xso.jpg" />
    <meta property="og:url" content="{{ url('/') }}" />
    <meta property="og:type" content="website" />

    <!-- Meta para Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Maro Uniformes" />
    <meta name="twitter:description" content="Ofrecemos uniformes de calidad en Concepción, Chile" />
    <meta name="twitter:image" content="https://res.cloudinary.com/dnbklbswg/image/upload/v1767750866/pragatilogo_cw8xso.jpg" />

    <!-- Fuentes -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts Laravel + Inertia + React -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
