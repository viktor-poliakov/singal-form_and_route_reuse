import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

/**
 * Кэширующая стратегия переиспользования роутов.
 *
 * Принцип работы:
 *  - Если у роута в `data` указан флаг `reuse: true`, при уходе с него
 *    Angular «отсоединяет» компонент от DOM, не уничтожая его (`shouldDetach -> true`).
 *  - Отсоединённый компонент сохраняется в Map по ключу полного пути (`store`).
 *  - При возврате на тот же путь компонент извлекается из кэша
 *    и подставляется обратно в DOM (`shouldAttach + retrieve`), минуя
 *    повторное создание и `ngOnInit`.
 *
 * Важные нюансы:
 *  - Закэшированный компонент остаётся «живым»: его сигналы, подписки и таймеры
 *    продолжают работать в фоне. Следите за нагрузкой/утечками.
 *  - `ngOnInit` / `ngOnDestroy` при возврате не вызываются — если нужно
 *    реагировать на повторный показ, подписывайтесь на Router events
 *    или на `ActivatedRoute` observables.
 */
@Injectable({ providedIn: 'root' })
export class CachedRouteReuseStrategy implements RouteReuseStrategy {
  /** Хранилище отсоединённых компонентов: ключ — путь, значение — handle. */
  private handlers = new Map<string, DetachedRouteHandle>();

  /**
   * Должен ли Angular сохранять компонент покидаемого роута?
   * Кэшируем только те, у которых в конфиге указано `data: { reuse: true }`.
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.isReusable(route);
  }

  /**
   * Вызывается Angular после `shouldDetach -> true`, передаёт «отсоединённый»
   * компонент. Если в будущем `handle === null` — это сигнал очистить кэш.
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.getKey(route);
    console.log({ key })

    if (!key) return;

    if (handle) {
      this.handlers.set(key, handle);
    } else {
      this.handlers.delete(key);
    }
  }

  /**
   * Есть ли в кэше сохранённый компонент для входящего роута?
   * Кэш используем только для роутов, помеченных `reuse: true`.
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (!this.isReusable(route)) return false;

    const key = this.getKey(route);
    return !!key && this.handlers.has(key);
  }

  /**
   * Если `shouldAttach -> true`, Angular берёт handle отсюда и вставляет
   * сохранённый компонент обратно в DOM без пересоздания.
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (!this.isReusable(route)) return null;

    const key = this.getKey(route);
    return (key && this.handlers.get(key)) || null;
  }

  /**
   * Переиспользовать ли тот же экземпляр компонента при переходе
   * между двумя снимками маршрута (например, при смене параметров)?
   *
   * Поведение по умолчанию: считаем роуты «теми же», если у них
   * совпадает `routeConfig`. То же самое делает `BaseRouteReuseStrategy`.
   */
  shouldReuseRoute(
    curr: ActivatedRouteSnapshot,
    future: ActivatedRouteSnapshot,
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  // --- helpers ---------------------------------------------------------------

  /** Помечен ли роут флагом `data: { reuse: true }`. */
  private isReusable(route: ActivatedRouteSnapshot): boolean {
    return !!route.data?.['reuse'];
  }

  /**
   * Ключ кэша — полный путь от корня. Берём именно `pathFromRoot`,
   * а не `routeConfig.path`, чтобы корректно различать вложенные/именованные
   * outlets и параметризованные сегменты.
   */
  private getKey(route: ActivatedRouteSnapshot): string | null {
    if (!route.routeConfig) return null;

    return route.pathFromRoot
      .map(r => r.url.map(seg => seg.toString()).join('/'))
      .filter(Boolean)
      .join('/');
  }
}
