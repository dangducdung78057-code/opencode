import { STAGEOS_MODULE_REGISTRY } from "@stageos/shared";

export default function HomePage() {
  const implemented = STAGEOS_MODULE_REGISTRY.filter((item) => item.status === "implemented").length;
  const reserved = STAGEOS_MODULE_REGISTRY.filter((item) => item.status === "reserved").length;

  return (
    <main>
      <h1>StageOS Engineering System</h1>
      <p>统一工程入口：模块注册、接口预留、数据契约、主流程编排。独立模块仍保留单独部署能力。</p>

      <section className="grid">
        <div className="card">
          <h2>模块统计</h2>
          <p>已实现模块：{implemented}</p>
          <p>预留接口组：{reserved}</p>
        </div>
        <div className="card">
          <h2>主系统接口</h2>
          <pre>{`GET  /api/stageos/system/status
GET  /api/stageos/system/module-registry
POST /api/stageos/system/orchestrate`}</pre>
        </div>
      </section>

      <section className="card">
        <h2>模块注册表</h2>
        <div className="grid">
          {STAGEOS_MODULE_REGISTRY.map((module) => (
            <article key={module.id} className="card">
              <h2>{module.title}</h2>
              <p><strong>ID：</strong>{module.id}</p>
              <p><strong>状态：</strong>{module.status}</p>
              <p><strong>路径：</strong>{module.packagePath ?? "主系统预留"}</p>
              <div>{module.routes.map((route) => <span className="badge" key={route}>{route}</span>)}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
