plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

val syncWebAssets = tasks.register<Sync>("syncWebAssets") {
    from(rootProject.projectDir.resolve("web")) {
        include("index.html", "prova.html", "css/**", "js/**", "assets/**")
    }
    into(layout.buildDirectory.dir("generated/webAssets"))
}

android {
    namespace = "br.com.gem.msamontador"
    compileSdk = 35

    defaultConfig {
        applicationId = "br.com.gem.msamontador"
        minSdk = 23
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    sourceSets.getByName("main").assets.srcDir(syncWebAssets.map { it.destinationDir })

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

tasks.named("preBuild").configure {
    dependsOn(syncWebAssets)
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.webkit:webkit:1.12.1")
}
