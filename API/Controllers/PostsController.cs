﻿using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : BaseApiController
    {
        private readonly BlogContext _context;
        private readonly IMapper _mapper;

        public PostsController(BlogContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<Post>>> GetPosts(string? orderBy)
        {
            var query = _context.Posts
                .Sort(orderBy)
                .AsQueryable();


            var items = await query.ToListAsync();
            return items;

        }
        [HttpGet("{id}", Name = "GetPost")]
        public async Task<ActionResult<Post>> GetPost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound(); // catches the cases when the post is null
            return post;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var category = await _context.Posts.Select(p => p.Category).Distinct().ToListAsync();
            return Ok(new { category });
        }

        //[Authorize(Roles = "Admin")]
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Post>> CreatePost([FromForm] CreatePostDto postDto)
        {
            var post = _mapper.Map<Post>(postDto);
            _context.Posts.Add(post);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return CreatedAtRoute("GetPost", new { Id = post.Id }, post);
            return BadRequest();
        }

        //[Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Post>> UpdatePost([FromForm] UpdatePostDto postDto)
        {
            var post = await _context.Posts.FindAsync(postDto.Id);
            if (post == null) return NotFound();
            _mapper.Map(postDto, post);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return NoContent();
            return BadRequest();
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();
            _context.Posts.Remove(post);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();
            return BadRequest();
        }





    }
}