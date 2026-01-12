# GitHub Metrics Quraşdırma Təlimatları

Bu README GitHub Metrics ilə təkmilləşdirilib. Metrics-i aktivləşdirmək üçün bu addımları izləyin:

## 📋 Tələblər

1. GitHub hesabınızda Personal Access Token yaratmalısınız
2. GitHub repository-nizdə Actions aktivləşdirilməlidir

## 🔧 Quraşdırma Addımları

### 1. Personal Access Token Yaratmaq

1. GitHub-a daxil olun
2. **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)** düyməsinə klikləyin
4. Token üçün ad verin (məsələn: "Metrics Token")
5. Aşağıdakı icazələri seçin:
   - ✅ `repo` (bütün sub-options)
   - ✅ `user` (bütün sub-options)
   - ✅ `read:org`
   - ✅ `read:user`
   - ✅ `read:project`
6. **Generate token** düyməsinə klikləyin
7. Token-i kopyalayın (yalnız bir dəfə göstəriləcək!)

### 2. Repository Secret Əlavə Etmək

1. GitHub repository-niz səhifəsinə gedin
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** düyməsinə klikləyin
4. Ad: `METRICS_TOKEN`
5. Value: Əvvəl kopyaladığınız token-i yapışdırın
6. **Add secret** düyməsinə klikləyin

### 3. GitHub Actions Workflow Əlavə Etmək

1. Repository-nizdə `.github/workflows` qovluğu yaradın (əgər yoxdursa)
   ```bash
   mkdir -p .github/workflows
   ```

2. `metrics.yml` faylının məzmununu `.github/workflows/metrics.yml` olaraq əlavə edin

3. Dəyişiklikləri commit və push edin:
   ```bash
   git add .github/workflows/metrics.yml
   git commit -m "Add GitHub Metrics workflow"
   git push
   ```

### 4. Actions-ı İşə Salmaq

1. Repository səhifənizdə **Actions** tab-ına gedin
2. "GitHub Metrics" workflow-nu seçin
3. **Run workflow** düyməsinə klikləyin
4. Workflow tamamlanandan sonra SVG fayllar repository-də görünəcək

### 5. README-ni Yeniləmək

1. Yeni `README.md` faylını repository-nizin əsas qovluğuna əlavə edin
2. Commit və push edin:
   ```bash
   git add README.md
   git commit -m "Update README with GitHub Metrics"
   git push
   ```

## 🎨 Fərdiləşdirmə

### Metrics-i Öz Ehtiyaclarınıza Uyğunlaşdırın

`metrics.yml` faylında aşağıdakı parametrləri dəyişə bilərsiniz:

- **Schedule**: Yeniləmə tezliyi
  ```yaml
  schedule:
    - cron: "0 0 * * *"  # Hər gün gecəyarı
  ```

- **Plugins**: İstədiyiniz plugin-ləri əlavə və ya çıxara bilərsiniz
- **Theme**: Tema rənglərini dəyişə bilərsiniz
- **Language Limit**: Göstəriləcək dil sayını tənzimləyə bilərsiniz

### Əlavə Plugin-lər

Metrics 47+ plugin dəstəkləyir. Əlavə plugin-lər əlavə etmək üçün:

1. [Lowlighter Metrics dokumentasiyasına](https://github.com/lowlighter/metrics) baxın
2. İstədiyiniz plugin-in konfiqurasiyasını `metrics.yml`-ə əlavə edin
3. README-də lazımi SVG-ləri əlavə edin

## 🔄 Avtomatik Yeniləmələr

Workflow aşağıdakı hallarda işə düşəcək:
- ✅ Hər gün avtomatik olaraq (gecəyarı UTC)
- ✅ `main` və ya `master` branch-ə push etdikdə
- ✅ Manual olaraq Actions tab-dan işə saldıqda

## 📊 Mövcud Metrics

README-də aşağıdakı metrics-lər var:
- 📈 Base metrics (header, activity, repositories)
- 📅 Isocalendar (commit calendar)
- 🈷️ Languages (indepth language analysis)
- 💡 Habits (coding habits & activity)
- 🎟️ Follow-up (issues & PRs)
- 🏆 Achievements (GitHub achievements)
- ✨ Stargazers (star charts & worldmap)
- 📰 Recent activity
- 🎩 Notable contributions
- 📆 Commit calendar

## ⚠️ Qeydlər

- İlk dəfə işə düşəndə SVG faylların yaranması 5-10 dəqiqə çəkə bilər
- Bəzi metrics-lər üçün kifayət qədər data olmaya bilər (yeni hesablar üçün)
- Token-in vaxtı bitdikdə yeni token yaradıb secret-i yeniləməyi unutmayın

## 🆘 Kömək

Əgər problem yaşasanız:
1. Actions log-larına baxın (repository → Actions)
2. Token icazələrini yoxlayın
3. [Metrics repository-də](https://github.com/lowlighter/metrics/issues) issue açın

## 📚 Əlavə Resurlar

- [GitHub Metrics Documentation](https://github.com/lowlighter/metrics)
- [Available Plugins](https://github.com/lowlighter/metrics#-plugins)
- [Configuration Examples](https://github.com/lowlighter/metrics/blob/master/.github/readme/partials/documentation/setup/action.md)

---

**Müvəffəqiyyətlər! 🚀**
