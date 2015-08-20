using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using BeastOnWeb.Models;
using System.IO;
using System.Reflection;

namespace BeastOnWeb.Controllers
{
    public class HomeController : Controller
    {
        private List<Activity> activities = new List<Activity>();
        private string filePath = Path.Combine(Path.GetDirectoryName(AppDomain.CurrentDomain.BaseDirectory), @"Content\times.json");
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            return View();
        }

        public ActionResult Portfolio()
        {
            return View();
        }

        public ActionResult TimeTracker()
        {
            return View();
        }

        public JsonResult GetActivities()
        {
            using (StreamReader r = new StreamReader(filePath))
            {
                string json = r.ReadToEnd();
                activities = JsonConvert.DeserializeObject<List<Activity>>(json);
                return Json(activities, JsonRequestBehavior.AllowGet);
            }
        }
        public void AddActivity(string activity)
        {
            GetActivities();
            int id;
            if (activities == null)
            {
                id = 1;
                activities = new List<Activity>();
            }
            else
            {
                id = activities.Count + 1;
            }
            var act = new Activity() { Id = id, Title = activity, StartTime = DateTime.Now, EndTime = DateTime.Now, TimeSpent = 0 };
            activities.Add(act);
            string json = JsonConvert.SerializeObject(activities.ToArray());

            //write string to file
            System.IO.File.WriteAllText(filePath, json);
        }

        public void EndActivity(string id)
        {
            GetActivities();
            var act = activities.Where(x => x.Id == Convert.ToInt32(id)).FirstOrDefault();
            act.EndTime = DateTime.Now;
            act.TimeSpent = (act.EndTime - act.StartTime).TotalHours;
            string json = JsonConvert.SerializeObject(activities.ToArray());

            //write string to file
            System.IO.File.WriteAllText(filePath, json);
        }

        public void ClearActivities()
        {
            System.IO.File.WriteAllText(filePath, "");
        }

    }
}
