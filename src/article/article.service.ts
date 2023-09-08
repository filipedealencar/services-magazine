import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import { DraftPosts, LatestPublications } from './article.entity';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class ArticleService {
  async getArticle(url: string): Promise<any> {
    const options = [
      {
        selector: `#${process.env.FIRST_SELECTOR}`,
        origin: process.env.FIRST_ORIGIN,
      },
      {
        selector: `.${process.env.SECOND_SELECTOR}`,
        origin: process.env.SECOND_ORIGIN,
      },
      {
        selector: process.env.THIRD_SELECTOR,
        origin: process.env.THIRD_ORIGIN,
      },
      {
        selector: process.env.FOURTH_SELECTOR,
        origin: process.env.FOURTH_ORIGIN,
      },
    ];

    try {
      const response = await axios.get(url);
      const articleHtml = response.data;
      let articleContent = {};

      options.map((select) => {
        if (url.includes(select.origin)) {
          return (articleContent = this.extractContent(
            articleHtml,
            select.selector,
          ));
        }
      });

      console.log(articleContent);

      DraftPosts.create({ post: articleContent, title: 'teste', url })
        .then(() => {
          console.log(
            'Novos dados foram inseridos com sucesso, na tabela de drafts',
          );
        })
        .catch((error) => {
          console.error(
            'Erro ao inserir novos dados, na tabela de drafts:',
            error,
          );
        });

      return articleContent;
    } catch (error) {
      console.log(error);
      console.log(url);
      throw new Error('Não foi possível capturar a notícia.');
    }
  }

  private extractContent(html: string, selector: string): Object {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const elementP = document.querySelector(selector).querySelectorAll('p');
    const contentP = {};
    elementP.forEach((element, indice) => {
      if (element.textContent.includes('Concern) –')) {
        return (contentP[`p${indice + 1}`] = element.textContent
          .split('Concern) –')[1]
          .trim());
      }
      return (contentP[`p${indice + 1}`] = element.textContent);
    });
    return contentP;
  }

  async checkForNewPublications(site: {
    domain: string;
    url: string;
    dataKey: string;
    mainSelector: string;
    titleSelector: any;
    urlSelector: any;
  }) {
    try {
      const response = await axios.get(site.url);
      const dom = new JSDOM(response.data);

      const newsElements: Array<HTMLAnchorElement> = Array.from(
        dom.window.document.querySelectorAll(site.mainSelector),
      );

      let newPublications = {
        [site.dataKey]: newsElements.map(
          (elem): { title: string; url: string } => {
            let valueUrl = elem.querySelector(site.urlSelector).href;
            if (!valueUrl.includes('http')) {
              if (elem.querySelector(site.urlSelector).href[0] === '/') {
                valueUrl = `${site.domain}${`${
                  elem.querySelector(site.urlSelector).href
                }`.slice(1)}`;
              } else {
                valueUrl = `${site.domain}${
                  elem.querySelector(site.urlSelector).href
                }`;
              }
            }
            return {
              title: elem.querySelector(site.titleSelector).textContent || '',
              url: valueUrl || '',
            };
          },
        ),
      };

      return { [site.dataKey]: newPublications[site.dataKey] };
    } catch (error) {
      console.error('Erro ao verificar novas publicações:', error);
    }
  }

  async checkForNewPublicationsForAllSites() {
    const sitesConfig = [
      {
        domain: process.env.FIRST_DOMAIN,
        url: process.env.FIRST_URL,
        mainSelector: process.env.FIRST_MAIN_SELECTOR,
        titleSelector: process.env.FIRST_TITLE_SELECTOR,
        urlSelector: process.env.FIRST_URL_SELECTOR,
      },
      {
        domain: process.env.SECOND_DOMAIN,
        url: process.env.SECOND_URL,
        mainSelector: process.env.SECOND_MAIN_SELECTOR,
        titleSelector: process.env.SECOND_TITLE_SELECTOR,
        urlSelector: process.env.SECOND_URL_SELECTOR,
      },
      {
        domain: process.env.THIRD_DOMAIN,
        url: process.env.THIRD_URL,
        mainSelector: process.env.THIRD_MAIN_SELECTOR,
        titleSelector: process.env.THIRD_TITLE_SELECTOR,
        urlSelector: process.env.THIRD_URL_SELECTOR,
      },
    ];

    const promises = sitesConfig.map((site, index) =>
      this.checkForNewPublications({ ...site, dataKey: `site${index + 1}` }),
    );
    const valuesArray = await Promise.all(promises);
    const newPublications = Object.assign({}, ...valuesArray);
    const latestePublication = await LatestPublications.findAll({
      raw: true,
    });

    const formatPublications = (
      publications: any,
    ): Record<string, { title: string; url: string }[]> => {
      const formattedData: Record<string, { title: string; url: string }[]> =
        {};

      for (const publication of publications) {
        const { site_key, title, url } = publication;

        if (!formattedData[site_key.trim()]) {
          formattedData[site_key.trim()] = [];
        }

        formattedData[site_key.trim()].push({ title, url });
      }

      return formattedData;
    };

    const formattedData = formatPublications(latestePublication);

    //   return formattedData;

    // let oldPublications = [];
    // if (fs.existsSync(dataFile)) {
    //   oldPublications = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    // }

    sitesConfig.map((site, index) => {
      // Compare as novas publicações com as anteriores
      const diff: { [x: string]: { title: string; url: string }[] } = {
        [`site${index + 1}`]: newPublications[`site${index + 1}`]?.filter(
          (newPub) => {
            return !formattedData[`site${index + 1}`]?.some(
              (oldPub) => oldPub.url === newPub.url,
            );
          },
        ),
      };

      const newsPublicationFormatted = Object.keys(newPublications)
        .map((ele, index) => {
          return newPublications[ele].map((e) => {
            return { ...e, site_key: ele };
          });
        })
        .reduce((obj, siteArray, index) => {
          const key = `site${index + 1}`;
          obj[key] = siteArray;
          //   .filter((item, i) => i <= 9);
          return obj;
        }, {});

      if (diff[`site${index + 1}`]?.length > 0) {
        // Há novas publicações! Faça algo com elas, como enviar uma notificação.
        console.log('Novas publicações encontradas:');
        console.log(diff);

        for (const site in diff) {
          const publications = diff[site];
          publications.forEach((publication) => {
            this.getArticle(publication.url);
          });
        }

        // Atualize os dados antigos com as novas publicações

        LatestPublications.destroy({ where: {} })
          .then(() => {
            console.log(
              'Todos os dados antigos da tabela foram excluídos com sucesso.',
            );
            LatestPublications.bulkCreate(
              newsPublicationFormatted[`site${index + 1}`],
            )
              .then(() => {
                console.log('Novos dados foram inseridos com sucesso.');
              })
              .catch((error) => {
                console.error('Erro ao inserir novos dados:', error);
              });
          })
          .catch((error) => {
            console.error('Erro ao excluir dados da tabela:', error);
          });

        // fs.writeFileSync(
        //   dataFile,
        //   JSON.stringify(newPublications, null, 2),
        //   'utf8',
        // );
      } else {
        console.log('Nenhuma nova publicação encontrada.');
      }
    });
  }

  // Defina um intervalo para verificar as novas publicações (por exemplo, a cada hora)
  //   setInterval(checkForNewPublications, 3600000); // 3600000 ms = 1 hora
}
