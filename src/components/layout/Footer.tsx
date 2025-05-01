
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full eregulariza-gradient flex items-center justify-center">
                <span className="font-bold text-white">e</span>
              </div>
              <span className="text-lg font-semibold">e-regulariza</span>
            </Link>
            <p className="text-sm text-gray-500">
              Transformando a experiência de regularização imobiliária em algo simples, transparente e confiável.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre" className="text-gray-500 hover:text-eregulariza-primary text-sm">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link to="/cases" className="text-gray-500 hover:text-eregulariza-primary text-sm">
                  Casos de sucesso
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-500 hover:text-eregulariza-primary text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/carreiras" className="text-gray-500 hover:text-eregulariza-primary text-sm">
                  Carreiras
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/servicos/usucapiao" className="text-gray-500 hover:text-eregulariza-primary text-sm">
                  Usucapião
                </Link>
              </li>
              <li>
                <Link to="/servicos/inventario" className="text-gray-500 hover:text-eregulariza-primary text-sm">
                  Inventário Extrajudicial
                </Link>
              </li>
              <li>
                <Link to="/servicos/retificacao" className="text-gray-500 hover:text-eregulariza-primary text-sm">
                  Retificação de Área
                </Link>
              </li>
              <li>
                <Link to="/servicos/demarcacao" className="text-gray-500 hover:text-eregulariza-primary text-sm">
                  Demarcação de Imóvel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="text-gray-500 text-sm">
                contato@eregulariza.com.br
              </li>
              <li className="text-gray-500 text-sm">
                +55 (11) 9999-9999
              </li>
              <li className="text-gray-500 text-sm">
                São Paulo, SP
              </li>
              <li className="flex space-x-3 mt-4">
                <a href="#" className="text-gray-500 hover:text-eregulariza-primary">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-eregulariza-primary">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-eregulariza-primary">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} e-regulariza. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4">
            <Link to="/privacidade" className="text-xs text-gray-500 hover:text-gray-700">
              Política de Privacidade
            </Link>
            <Link to="/termos" className="text-xs text-gray-500 hover:text-gray-700">
              Termos de Uso
            </Link>
            <Link to="/cookies" className="text-xs text-gray-500 hover:text-gray-700">
              Política de Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
